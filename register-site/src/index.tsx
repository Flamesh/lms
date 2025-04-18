import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import App from "./App";
import { UserProvider } from "./components/contexts/UserContext";
import './i18n';
import "./assets/index.css"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <UserProvider>
    <BrowserRouter>
      <ToastContainer />
      <App />
    </BrowserRouter>
  </UserProvider>
);
