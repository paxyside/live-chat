import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {MainScreen} from "./components/MainScreen";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainScreen/>
  </StrictMode>,
);