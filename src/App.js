import React from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hooks
import AuthButtons from "./AuthButtons";
import Dictionary from "./Dictionary";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  // Hiển thị màn hình loading nếu đang kiểm tra trạng thái
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderBottom: "2px solid #e9ecef",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#343a40",
            margin: 0,
          }}
        >
          Dictionary
        </h1>
        <AuthButtons />
      </header>
      <main
        style={{
          padding: "20px",
        }}
      >
        {isAuthenticated ? (
          <Dictionary /> // Hiển thị Dictionary nếu đã đăng nhập
        ) : (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Bạn cần đăng nhập để sử dụng ứng dụng.</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
  