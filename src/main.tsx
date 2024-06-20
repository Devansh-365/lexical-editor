import "./styles.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="text-center">
      <h1 className="text-4xl mt-20 mb-12 text-red-500 underline">
        React.js Rich Text Lexical Example
      </h1>
      <App />
    </div>
  </React.StrictMode>,
);
