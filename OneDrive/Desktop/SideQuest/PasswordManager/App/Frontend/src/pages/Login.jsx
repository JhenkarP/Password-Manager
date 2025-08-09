// src/pages/Login.jsx
import { useState } from "react";
import { Shield, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import InputField from "../components/ui/InputField";
import PasswordField from "../components/ui/PasswordField";
import Button from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const { theme, choose } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [stat, setStat] = useState({ loading: false, message: "", error: false });

  const submit = async (e) => {
    e.preventDefault();
    setStat({ loading: true, message: "", error: false });
    const res = await login(form.username.trim(), form.password);
    setStat({ loading: false, message: res.message, error: !res.success });
    if (res.success) navigate("/dashboard");
  };

  const btnCls = `
    w-full py-3 rounded-lg text-white disabled:opacity-50 transition
    ${choose(
      "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
      "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
    )}
  `;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${choose(
        "bg-gray-50",
        "bg-gray-900"
      )}`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-xl shadow ${choose(
          "bg-white",
          "bg-gray-800"
        )}`}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-3xl font-bold ${choose("text-gray-900", "text-gray-100")}`}>
            Welcome Back
          </h2>
          <p className={choose("text-gray-600", "text-gray-400")}>
            Sign in to your SecureVault account
          </p>
        </div>

        <form className="space-y-6" onSubmit={submit}>
          <InputField
            id="username"
            label="Username"
            icon={User}
            value={form.username}
            onChange={(v) => setForm({ ...form, username: v })}
            placeholder="Enter username"
            autoComplete="username"
          />

          <PasswordField
            id="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />

          <Button type="submit" loading={stat.loading} className={btnCls}>
            Sign In
          </Button>
        </form>

        {stat.message && (
          <p
            className={`mt-4 text-center text-sm ${
              stat.error ? "text-red-600" : "text-green-500"
            }`}
          >
            {stat.message}
          </p>
        )}

        <p className={`mt-6 text-center text-sm ${choose("text-gray-600", "text-gray-400")}`}>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
