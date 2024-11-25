import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react'; // Import Auth0Provider
import App from './App';
import './index.css';

// Thay bằng thông tin từ Auth0 Dashboard
const domain = "dev-krykox1jnhghdidl.us.auth0.com"; 
const clientId = "1F3M1rAcwZGBMP1rOYsvPd4uYrLNf5H5"; 

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin, // URL sẽ chuyển đến sau khi đăng nhập thành công
    }}
    cacheLocation="localstorage" // Lưu token để duy trì trạng thái đăng nhập
    useRefreshTokens={true} // Sử dụng refresh token để gia hạn phiên làm việc
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
