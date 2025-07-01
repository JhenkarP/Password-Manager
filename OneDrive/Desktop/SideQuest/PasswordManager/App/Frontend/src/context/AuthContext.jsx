import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const AuthContext = createContext();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (username, password) => {
    const { data } = await axios.get("/api/user/me", {
      auth: { username, password },
    });
    return data.role;
  };

  useEffect(() => {
    (async () => {
      const saved = localStorage.getItem("auth");
      if (!saved) return setLoading(false);

      const creds = JSON.parse(saved);
      try {
        const role = await fetchRole(creds.username, creds.password);
        axios.defaults.auth = creds;
        setUser({ ...creds, role, isAdmin: role === "ROLE_ADMIN" });
      } catch {
        localStorage.removeItem("auth");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (username, password) => {
    try {
      await axios.get("/api/user/hello", { auth: { username, password } });
      const role = await fetchRole(username, password);

      const authObj = { username, password };
      localStorage.setItem("auth", JSON.stringify(authObj));
      axios.defaults.auth = authObj;
      setUser({ ...authObj, role, isAdmin: role === "ROLE_ADMIN" });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.status === 401 ? "Invalid credentials" : "Login failed",
      };
    }
  };

  const register = async (username, password) => {
    try {
      const { data } = await axios.post("/api/user/register", {
        username,
        password,
      });
      return { success: true, message: data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data || "Registration failed",
      };
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
