import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react'; // Thêm Auth0Provider
import App from './App';
import './index.css';

const domain = "dev-krykox1jnhghdidl.us.auth0.com"; // Thay bằng domain từ Auth0
const clientId = "0YngN4e9thEDZsP3YWX463yLH5OAem1e"; // Thay bằng clientId từ Auth0

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
