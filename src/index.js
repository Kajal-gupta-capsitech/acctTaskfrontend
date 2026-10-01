import React from "react";
import ReactDOM from "react-dom/client";

import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import App from "./App";
import { AppProvider } from "./context/AppContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
       <AppProvider> 
      <App />
      </AppProvider>
    </FluentProvider>
  // {/* </React.StrictMode> */}
);