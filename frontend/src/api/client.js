import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const path = window.location.pathname;
            // Prevent redirect loops on public/auth pages
            if (
                path !== "/login" &&
                path !== "/register" &&
                path !== "/forgot-password" &&
                path !== "/reset-password" &&
                path !== "/"
            ) {
                localStorage.removeItem("doctor");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
