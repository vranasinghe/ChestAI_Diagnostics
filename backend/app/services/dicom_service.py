import pydicom
import numpy as np
from PIL import Image
import io

def convert_dicom_to_png(dicom_bytes: bytes) -> bytes:
    """
    Read DICOM file bytes and convert the pixel array to PNG bytes.
    Handles standard windowing if window attributes are present.
    """
    try:
        # Load DICOM dataset from bytes
        fp = io.BytesIO(dicom_bytes)
        ds = pydicom.dcmread(fp)
        
        # Get pixel array
        pixels = ds.pixel_array.astype(float)
        
        # Check for windowing (Window Center, Window Width)
        if "WindowCenter" in ds and "WindowWidth" in ds:
            # Handle list or single values
            center = ds.WindowCenter
            width = ds.WindowWidth
            if isinstance(center, pydicom.multival.MultiValue):
                center = float(center[0])
            else:
                center = float(center)
            if isinstance(width, pydicom.multival.MultiValue):
                width = float(width[0])
            else:
                width = float(width)
                
            # Windowing formula
            low = center - width / 2.0
            high = center + width / 2.0
            pixels = np.clip(pixels, low, high)
            pixels = ((pixels - low) / (high - low)) * 255.0
        else:
            # Simple min-max scaling fallback
            min_val = np.min(pixels)
            max_val = np.max(pixels)
            if max_val > min_val:
                pixels = ((pixels - min_val) / (max_val - min_val)) * 255.0
            else:
                pixels = np.zeros_like(pixels)

        # Convert to uint8 grayscale
        pixels = pixels.astype(np.uint8)
        
        # Check if photometric interpretation is MONOCHROME1 (inverted)
        if getattr(ds, "PhotometricInterpretation", "") == "MONOCHROME1":
            pixels = 255 - pixels
            
        img = Image.fromarray(pixels)
        out_buf = io.BytesIO()
        img.save(out_buf, format="PNG")
        return out_buf.getvalue()
    except Exception as e:
        raise ValueError(f"Failed to process DICOM file: {str(e)}")
