import React from "react";
import AuthButtons from "./AuthButtons";
import Dictionary from "./Dictionary";

function App() {
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
        <Dictionary />
      </main>
    </div>
  );
}

export default App;
