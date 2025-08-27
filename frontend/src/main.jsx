// // main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./redux/store";
import { ThemeProvider } from "./context/ThemeContext";
import AppProvider from "./context/AppContext";
import router from "./routes";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ReduxProvider store={store}>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </ReduxProvider>
    </ThemeProvider>
  </React.StrictMode>
);
