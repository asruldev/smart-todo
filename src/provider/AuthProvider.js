import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../firebase/authService";

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const resp = await AuthService.signInWithGoogle();
      setUser(resp);
      window.localStorage.setItem("smart-todo/user", JSON.stringify(resp))
      navigate("/dashboard");
    } catch (error) {}
  };

  const handleLogout = async () => {
    try {
        await AuthService.logout()
        navigate("/")
    } catch (error) {
        
    } finally {
        window.localStorage.clear()
        setUser(null);
    }
  };

  useEffect(() => {
    setLoading(true)
    const user = window.localStorage.getItem("smart-todo/user")
    setUser(JSON.parse(user));
    setLoading(false)
  }, [])

  const value = {
    user,
    loading,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
