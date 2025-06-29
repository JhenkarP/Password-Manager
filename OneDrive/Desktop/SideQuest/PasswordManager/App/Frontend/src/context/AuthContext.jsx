import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080"; // Spring‑Boot dev server

const AuthContext = createContext();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const creds = JSON.parse(saved);
      axios.defaults.auth = creds;
      setUser(creds);
    }
    setLoading(false);
  }, []);

  /* API helpers */
  const login = async (username, password) => {
    try {
      await axios.get("/api/user/hello", { auth: { username, password } });
      const creds = { username, password };
      localStorage.setItem("auth", JSON.stringify(creds));
      axios.defaults.auth = creds;
      setUser(creds);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.status === 401 ? "Invalid credentials" : "Login failed"
      };
    }
  };

  const register = async (username, password) => {
    try {
      const { data } = await axios.post("/api/user/register", { username, password });
      return { success: true, message: data };
    } catch (err) {
      return { success: false, message: err.response?.data || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    delete axios.defaults.auth;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};