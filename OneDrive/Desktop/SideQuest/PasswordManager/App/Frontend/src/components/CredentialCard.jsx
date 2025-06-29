import { useState } from "react";
import { Copy, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

export default function CredentialCard({ credential, onEdit, onDelete }) {
  const [showPw, setShowPw] = useState(false);

  const copy = async txt => {
    try {
      await navigator.clipboard.writeText(txt);
    } catch (_) {}
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{credential.serviceName[0].toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{credential.serviceName}</h3>
            <p className="text-sm text-gray-600">{credential.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => copy(credential.password)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Copy">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={() => onEdit(credential)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(credential.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between font-mono text-sm">
        <span>Password:</span>
        <div className="flex items-center space-x-2">
          <span>{showPw ? credential.password : "••••••••"}</span>
          <button onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}