import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      {isAuthenticated ? (
        <>
          {/* Avatar */}
          <img
            src={user.picture}
            alt="User Avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "2px solid #4A90E2",
              objectFit: "cover",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
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
          {/* Nút đăng xuất */}
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            style={{
              backgroundColor: "#FF6B6B",
              color: "#fff",
              padding: "10px 20px",
              fontSize: "14px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s ease, transform 0.2s ease",
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#4A90E2", // Màu gradient hoặc sáng hơn
            color: "#fff",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "25px", // Nút bo tròn
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Đổ bóng nhẹ
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#357ABD"; // Màu hover
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
