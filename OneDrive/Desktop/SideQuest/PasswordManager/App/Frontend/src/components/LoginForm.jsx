import { useState } from "react";
import { Eye, EyeOff, Shield, User, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  /* ──────────────────────────────────────────────────
   *  Local state
   * ──────────────────────────────────────────────────*/
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPw, setShowPw]   = useState(false);
  const [stat, setStat] = useState({ loading: false, message: "", error: false });

  /* ──────────────────────────────────────────────────
   *  Handlers
   * ──────────────────────────────────────────────────*/
  const submit = async e => {
    e.preventDefault();
    setStat({ loading: true, message: "", error: false });

    const res = await login(form.username.trim(), form.password);

    setStat({ loading: false, message: res.message, error: !res.success });

    if (res.success) navigate("/dashboard");
  };

  /* ──────────────────────────────────────────────────
   *  Render
   * ──────────────────────────────────────────────────*/
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        {/* ── header ─────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your SecureVault account</p>
        </div>

        {/* ── form ─────────────────────────────── */}
        <form className="space-y-6" onSubmit={submit}>
          {/* username */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="username">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="username"
                required
                autoComplete="username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>
          </div>

          {/* password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                required
                autoComplete="current-password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPw(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* submit */}
          <button
            disabled={stat.loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg disabled:opacity-50"
          >
            {stat.loading ? "Signing In…" : "Sign In"}
          </button>
        </form>

        {/* status message */}
        {stat.message && (
          <p className={`mt-4 text-center text-sm ${stat.error ? "text-red-600" : "text-green-600"}`}>
            {stat.message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account? {" "}
          <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}