import { Routes, Route, Navigate } from "react-router-dom";
import Casino from "./layouts/casino";
import SignIn from "./layouts/auth/signIn";
import SignUp from './layouts/auth/register';
import ForgotPassword from './layouts/auth/forgot-password';
import Term from './layouts/auth/term'
import { useEffect } from "react";
import i18n from "./i18n";
import "./assets/index.scss"

const ProtectedRoute = ({ children } : any) => {
  const username = localStorage.getItem("username");
  const params = new URLSearchParams(window.location.search);

  const action = params.get("action");

  const isLogoutAction = action === "logout";
  if (isLogoutAction) {
    localStorage.removeItem('username');
    return <Navigate to="/auth" replace />;
  }
  return (username) ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang: string | any = localStorage.getItem('i18nextLng');
      i18n.changeLanguage('vi');
    };
    window.addEventListener('storage', handleLanguageChange);
    return () => {
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/terms" element={<Term />} />
    </Routes>
  );
};

export default App;
