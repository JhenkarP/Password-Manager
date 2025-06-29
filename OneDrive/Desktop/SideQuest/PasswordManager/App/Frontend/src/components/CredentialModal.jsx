import { useEffect, useState } from "react";

export default function CredentialModal({ isOpen, onClose, credential, onSave }) {
  const [form, setForm] = useState({ serviceName: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (credential) setForm({ serviceName: credential.serviceName, username: credential.username, password: credential.password });
    else setForm({ serviceName: "", username: "", password: "" });
  }, [credential]);

  if (!isOpen) return null;

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">{credential ? "Edit Credential" : "Add Credential"}</h2>
        <form className="space-y-4" onSubmit={submit}>
          {[
            ["serviceName", "Service Name"],
            ["username", "Username / Email"],
            ["password", "Password"]
          ].map(([k, label]) => (
            <div key={k}>
              <label className="block text-sm mb-1 text-gray-700">{label}</label>
              <input
                required
                value={form[k]}
                onChange={e => setForm({ ...form, [k]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 border px-4 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50">
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}