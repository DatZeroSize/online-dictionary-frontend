export const auth0Config = {
    domain: "dev-krykox1jnhghdidl.us.auth0.com", // Domain từ Auth0 Dashboard
    clientId: "1F3M1rAcwZGBMP1rOYsvPd4uYrLNf5H5", // Client ID từ Auth0 Dashboard
    redirectUri: "https://online-dictionary-frontend.onrender.com", // URL triển khai thực tế của ứng dụng
    audience: "https://dictionary-backend-ocuq.onrender.com", // URL API của bạn (nếu có)
    scope: "read:data write:data", // Các quyền API cần thiết
};
