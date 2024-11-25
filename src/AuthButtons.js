import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  // CSS cho Avatar
  const avatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid #4A90E2",
    objectFit: "cover",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  // CSS cho nút
  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      {isAuthenticated ? (
        <>
          {/* Avatar */}
          <img
            src={user.picture}
            alt="User Avatar"
            style={avatarStyle}
            title={user.name}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.1)";
              e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          />
          {/* Tên người dùng */}
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: "bold",
                color: "#343a40",
              }}
            >
              {user.name}
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#6c757d" }}>
              {user.email}
            </p>
          </div>
          {/* Nút Đăng xuất */}
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            style={{
              ...buttonStyle,
              backgroundColor: "#FF6B6B",
              color: "#fff",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#E04444";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#FF6B6B";
              e.target.style.transform = "scale(1)";
            }}
          >
            Đăng xuất
          </button>
        </>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          style={{
            ...buttonStyle,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#4A90E2",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "25px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#357ABD";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#4A90E2";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/20/ffffff/login-rounded-right.png"
            alt="Login Icon"
            style={{ width: "20px", height: "20px" }}
          />
          Đăng nhập
        </button>
      )}
    </div>
  );
};

export default AuthButtons;
