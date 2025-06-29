import { useEffect, useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: false });
  const [pwd, setPwd] = useState("");

  useEffect(() => generate(), [length, opts]);

  const generate = () => {
    let chars = "";
    if (opts.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (opts.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (opts.numbers) chars += "0123456789";
    if (opts.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let res = "";
    for (let i = 0; i < length; i++) res += chars[Math.floor(Math.random() * chars.length)];
    setPwd(res);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pwd);
    } catch (_) {}
  };

  const toggle = k => setOpts({ ...opts, [k]: !opts[k] });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-lg mx-auto">
      <h3 className="text-lg font-semibold mb-4">Password Generator</h3>

      <div className="flex items-center space-x-2 mb-4">
        <input readOnly value={pwd} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm" />
        <button onClick={copy} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <label className="block text-sm mb-1">Length: {length}</label>
      <input type="range" min="8" max="64" value={length} onChange={e => setLength(+e.target.value)} className="w-full mb-4" />

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        {[
          ["uppercase", "Uppercase"],
          ["lowercase", "Lowercase"],
          ["numbers", "Numbers"],
          ["symbols", "Symbols"]
        ].map(([k, label]) => (
          <label key={k} className="flex items-center space-x-2">
            <input type="checkbox" checked={opts[k]} onChange={() => toggle(k)} className="rounded" />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <button onClick={generate} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2">
        <RefreshCw className="w-4 h-4" /> <span>Generate</span>
      </button>
    </div>
  );
}