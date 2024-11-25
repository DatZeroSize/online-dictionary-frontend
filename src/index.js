import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react'; // Thêm Auth0Provider
import App from './App';
import './index.css';

const domain = "dev-krykox1jnhghdidl.us.auth0.com"; // Thay bằng domain từ Auth0
const clientId = "1F3M1rAcwZGBMP1rOYsvPd4uYrLNf5H5"; // Thay bằng clientId từ Auth0
const audience = "https://dictionary-backend-ocuq.onrender.com"; // URL API backend của bạn
const redirectUri = "https://online-dictionary-frontend.onrender.com"; // URL ứng dụng frontend của bạn

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: redirectUri, // Đảm bảo đây là URL chính xác
      audience: audience, // URL API bạn muốn kết nối
      scope: "read:data write:data", // Các quyền API bạn cần
    }}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
