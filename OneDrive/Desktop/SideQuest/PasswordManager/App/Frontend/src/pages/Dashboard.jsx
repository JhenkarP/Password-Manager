import { Key, Plus, RefreshCw, Settings, Shield, ShieldAlert, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CredentialCard from "../components/CredentialCard";
import CredentialModal from "../components/CredentialModal";
import PasswordGenerator from "../components/PasswordGenerator";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("credentials");
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCreds = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/credentials/me");
      setCredentials(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchCreds();
  }, []);

  const save = async obj => {
    if (edit) {
      const { data } = await axios.put("/api/credentials/change", { id: edit.id, ...obj });
      setCredentials(credentials.map(c => (c.id === edit.id ? data : c)));
    } else {
      const { data } = await axios.post("/api/credentials/add", obj);
      setCredentials([...credentials, data]);
    }
    setModal(false);
    setEdit(null);
  };

  const del = async id => {
    if (!window.confirm("Delete credential?")) return;
    setCredentials(credentials.filter(c => c.id !== id));
  };

  const filtered = credentials.filter(
    c =>
      c.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Passwords", value: credentials.length },
    { label: "Weak (<12 chars)", value: credentials.filter(c => c.password.length < 12).length },
    { label: "Displayed", value: filtered.length }
  ];

  const nav = [
    ["credentials", "My Passwords", Key],
    ["generator", "Generator", RefreshCw],
    ["settings", "Settings", Settings],
    ...(user.isAdmin ? [["admin", "Admin", ShieldAlert]] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-3 p-6 border-b">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SecureVault</h1>
              <p className="text-xs text-gray-600">Password Manager</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {nav.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => {
                  if (id === "admin") navigate("/admin");
                  else setActive(id);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  active === id ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" /> <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-gray-600">{user.isAdmin ? "Admin" : "Free Plan"}</p>
                </div>
              </div>
              <button onClick={logout} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8">
        {active === "credentials" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">My Passwords</h1>
                <p className="text-gray-600">Manage your saved credentials</p>
              </div>
              <button
                onClick={() => {
                  setEdit(null);
                  setModal(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" /> <span>Add</span>
              </button>
            </div>

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full max-w-md mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map(s => (
                <div key={s.label} className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-sm text-gray-600">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            {loading ? (
              <p>Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-600">No credentials found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(c => (
                  <CredentialCard
                    key={c.id}
                    credential={c}
                    onEdit={cred => {
                      setEdit(cred);
                      setModal(true);
                    }}
                    onDelete={del}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {active === "generator" && <PasswordGenerator />}
        {active === "settings" && <p className="text-gray-600">Settings coming soon…</p>}
      </main>

      <CredentialModal isOpen={modal} onClose={() => setModal(false)} credential={edit} onSave={save} />
    </div>
  );
}
