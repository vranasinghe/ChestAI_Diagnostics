import torch
import torchvision.transforms as transforms
import torchvision.models as models
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
import io
import os
import base64
import numpy as np
import cv2


class GradCAM:
    """
    Grad-CAM implementation that properly cleans up its hooks after use.
    Use as a context manager or call .remove() when done.
    """
    def __init__(self, target_layer):
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None

        # Store hook handles so we can remove them later (prevents memory leak)
        self._fwd_handle = target_layer.register_forward_hook(self._save_activation)
        self._bwd_handle = target_layer.register_full_backward_hook(self._save_gradient)

    def _save_activation(self, module, input, output):
        self.activations = output.detach()

    def _save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def remove(self):
        """Remove registered hooks to avoid memory leaks."""
        self._fwd_handle.remove()
        self._bwd_handle.remove()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.remove()

    def generate_cam(self) -> np.ndarray | None:
        if self.gradients is None or self.activations is None:
            return None

        # Global average pool gradients over spatial dims → per-channel weights
        weights = torch.mean(self.gradients, dim=(2, 3), keepdim=True)
        cam = torch.sum(weights * self.activations, dim=1, keepdim=True)

        cam = F.relu(cam)
        cam = cam.squeeze().cpu().numpy()

        # Normalize to [0, 1]
        cam_min = np.min(cam)
        cam = cam - cam_min
        cam_max = np.max(cam)
        if cam_max > 0:
            cam = cam / cam_max
        return cam


class XRayInferenceService:
    """
    Two-stage X-Ray inference:
    1. Binary DenseNet-121 model → Normal vs Abnormal
    2. EfficientNet-V2-S multiclass model → Specific disease classification
    Both stages produce Grad-CAM heatmaps.
    """

    OUTPUT_LABELS = ['Atelectasis', 'Cardiomegaly', 'Emphysema', 'Pneumonia', 'Mass', 'Pneumothorax']
    LABEL_COLORS = {
        'Pneumonia': '#f97316',
        'Mass': '#8b5cf6',
        'Pneumothorax': '#22d3ee',
        'Atelectasis': '#eab308',
        'Cardiomegaly': '#ef4444',
        'Emphysema': '#6366f1',
    }

    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        weights_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'weights')
        self._binary_path = os.path.join(weights_dir, 'Binary_Model.pth')
        self._multi_path = os.path.join(weights_dir, 'MultiClass_Ensemple_Model.pt')

        print(f'Initializing Inference Service... Device: {self.device}')
        self.binary_model = self._load_binary_model()
        self.multi_model = self._load_multi_model()

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    # ── Model loading ──────────────────────────────────────────────────────

    def _load_binary_model(self) -> nn.Module | None:
        print(f'Attempting to load Binary model from {self._binary_path}')
        try:
            model = models.densenet121(weights=None)
            num_ftrs = model.classifier.in_features  # 1024
            model.classifier = nn.Sequential(
                nn.Identity(),          # 0
                nn.Identity(),          # 1
                nn.BatchNorm1d(num_ftrs),  # 2
                nn.Dropout(p=0.5),      # 3
                nn.Linear(num_ftrs, 512),  # 4
                nn.ReLU(),              # 5
                nn.BatchNorm1d(512),    # 6
                nn.Dropout(p=0.5),      # 7
                nn.Linear(512, 1),      # 8
            )

            if os.path.exists(self._binary_path):
                state_dict = torch.load(self._binary_path, map_location=self.device)
                if 'state_dict' in state_dict:
                    state_dict = state_dict['state_dict']

                # Strip 'backbone.' prefix added by some training wrappers
                cleaned = {}
                for k, v in state_dict.items():
                    cleaned[k.replace('backbone.', '', 1) if k.startswith('backbone.') else k] = v

                model.load_state_dict(cleaned, strict=False)
                print('Binary model weights loaded successfully.')
            else:
                print(f'WARNING: Binary model weights not found at {self._binary_path}. Running with random weights.')

            model.to(self.device).eval()
            return model

        except Exception as exc:
            print(f'Error loading binary model: {exc}')
            return None

    def _load_multi_model(self) -> nn.Module | None:
        print(f'Attempting to load Multiclass model from {self._multi_path}')
        try:
            model = models.efficientnet_v2_s(weights=None)
            model.classifier = nn.Sequential(
                nn.BatchNorm1d(1280),
                nn.Dropout(p=0.5),
                nn.Linear(1280, 512),
                nn.ReLU(),
                nn.BatchNorm1d(512),
                nn.Dropout(p=0.5),
                nn.Linear(512, len(self.OUTPUT_LABELS)),
            )

            if os.path.exists(self._multi_path):
                state_dict = torch.load(self._multi_path, map_location=self.device)
                if 'state_dict' in state_dict:
                    state_dict = state_dict['state_dict']
                model.load_state_dict(state_dict, strict=False)
                print('Successfully loaded EfficientNet-V2-S Multiclass model.')
            else:
                print(f'WARNING: Multiclass model weights not found at {self._multi_path}. Running with random weights.')

            model.to(self.device).eval()
            return model

        except Exception as exc:
            print(f'Error loading multi-class model: {exc}')
            return None

    # ── Heatmap overlay ────────────────────────────────────────────────────

    def _generate_heatmap_overlay(self, image_bytes: bytes, cam_map: np.ndarray | None, image_uuid: str) -> str:
        """Blend a Grad-CAM heat map onto the original image and save it to /storage."""
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            img_arr = np.array(img)

            if cam_map is not None and cam_map.ndim == 2:
                cam_resized = cv2.resize(cam_map, (img_arr.shape[1], img_arr.shape[0]))
                heatmap = cv2.applyColorMap(np.uint8(255 * cam_resized), cv2.COLORMAP_JET)
                heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
                blended = cv2.addWeighted(img_arr, 0.6, heatmap, 0.4, 0)
                out_img = Image.fromarray(blended)
            else:
                out_img = img

            path = f"/storage/heatmap_{image_uuid}.jpg"
            out_img.save(path, format='JPEG')
            return f"/storage/heatmap_{image_uuid}.jpg"

        except Exception as exc:
            print(f'Error overlaying heatmap: {exc}')
            return f"/storage/raw_{image_uuid}.jpg"

    # ── Main predict ───────────────────────────────────────────────────────

    def predict_from_file(self, image_uuid: str) -> dict:
        """
        Run binary + multiclass inference reading from file system.
        """
        raw_path = f"/storage/raw_{image_uuid}.jpg"
        with open(raw_path, "rb") as f:
            image_bytes = f.read()
        return self.predict(image_bytes, image_uuid)

    def predict(self, image_bytes: bytes, image_uuid: str = "temp") -> dict:
        """
        Run binary + multiclass inference with Grad-CAM visualization.

        Returns:
            {
                predictions: list[{name, percent, color}],  # sorted descending
                heatmap_base64: str,                        # data URI / file path
                is_abnormal: bool,
                raw_image: str,                             # path to raw image
            }
        """
        # Parse image
        try:
            pil_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        except Exception as exc:
            print(f'Image processing error: {exc}')
            return {'error': 'Invalid image file', 'predictions': [], 'heatmap_base64': None, 'is_abnormal': False}

        # Pre-process: forward pass does NOT need gradients
        with torch.no_grad():
            tensor = self.transform(pil_image).unsqueeze(0).to(self.device)

        predictions: list[dict] = []
        prob: float | None = None   # binary sigmoid probability (safe default)
        is_abnormal: bool = False
        cam_map: np.ndarray | None = None

        # ── Stage 1: Binary classification ─────────────────────────────────
        if self.binary_model is not None:
            try:
                # We need gradients for Grad-CAM backward, so enable_grad here
                with GradCAM(self.binary_model.features.denseblock4) as grad_cam:
                    # Forward with grad tracking enabled
                    with torch.enable_grad():
                        binary_tensor = tensor.clone().requires_grad_(True)
                        self.binary_model.zero_grad()
                        output = self.binary_model(binary_tensor)

                    prob = torch.sigmoid(output).item()
                    is_abnormal = prob > 0.5

                    # Only compute binary heatmap when multi-model is absent
                    if is_abnormal and self.multi_model is None:
                        with torch.enable_grad():
                            output.backward()
                        cam_map = grad_cam.generate_cam()

            except Exception as exc:
                print(f'Binary inference error: {exc}')
                is_abnormal = True  # fail-safe: assume abnormal so multi-model runs

        else:
            # No binary model → assume abnormal so multiclass model can run
            is_abnormal = True

        # ── Stage 2: Multiclass classification (only if abnormal) ──────────
        if is_abnormal and self.multi_model is not None:
            try:
                with GradCAM(self.multi_model.features[-1]) as grad_cam:
                    with torch.enable_grad():
                        multi_tensor = tensor.clone().requires_grad_(True)
                        self.multi_model.zero_grad()
                        outputs = self.multi_model(multi_tensor)

                    probs = torch.sigmoid(outputs).squeeze().cpu().detach().numpy()
                    if probs.ndim == 0:
                        probs = np.expand_dims(probs, 0)

                    if probs.size >= len(self.OUTPUT_LABELS):
                        predictions = [
                            {
                                'name': label,
                                'percent': int(probs[i] * 100),
                                'color': self.LABEL_COLORS.get(label, '#3b82f6'),
                            }
                            for i, label in enumerate(self.OUTPUT_LABELS)
                        ]

                        # Grad-CAM on the highest-probability class
                        best_idx = int(np.argmax(probs))
                        with torch.enable_grad():
                            outputs[0, best_idx].backward()
                        cam_map = grad_cam.generate_cam()

            except Exception as exc:
                print(f'Multiclass inference error: {exc}')

        # ── Format final output ─────────────────────────────────────────────
        if not is_abnormal:
            normal_pct = int((1.0 - prob) * 100) if prob is not None else 99
            predictions.append({
                'name': 'Normal (No Findings)',
                'percent': normal_pct,
                'color': '#10b981',
            })
        elif not predictions:
            # Abnormal but multiclass gave no results
            abnormal_pct = int(prob * 100) if prob is not None else 85
            predictions.append({
                'name': 'Abnormal Detected',
                'percent': abnormal_pct,
                'color': '#ef4444',
            })

        predictions.sort(key=lambda x: x['percent'], reverse=True)
        heatmap = self._generate_heatmap_overlay(image_bytes, cam_map, image_uuid)

        low_confidence = False
        if is_abnormal and predictions:
            if predictions[0]['percent'] < 50:
                low_confidence = True

        return {
            'predictions': predictions[:5],
            'heatmap_base64': heatmap,
            'is_abnormal': is_abnormal,
            'raw_image': f"/storage/raw_{image_uuid}.jpg",
            'low_confidence': low_confidence,
        }


# Singleton — loaded once at startup
inference_service = XRayInferenceService()
