import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "" });

  useEffect(() => {
    axios.get("/api/admin/users").then(res => setUsers(res.data));
  }, []);

  const addUser = async () => {
    if (!newUser.username || !newUser.password) return;
    const { data } = await axios.post("/api/admin/add-user", newUser);
    setUsers([...users, data]);
    setNewUser({ username: "", password: "" });
  };

  const deleteUser = async id => {
    await axios.delete(`/api/admin/delete-user/${id}`);
    setUsers(users.filter(u => u.id !== id));
  };

  if (!user?.isAdmin) return <Navigate to="/dashboard" />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin · Users</h1>

      <div className="flex space-x-2 mb-6">
        <input
          className="border px-2 py-1 rounded"
          placeholder="username"
          value={newUser.username}
          onChange={e => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          className="border px-2 py-1 rounded"
          placeholder="password"
          value={newUser.password}
          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button
          onClick={addUser}
          className="bg-blue-500 text-white px-3 py-1 rounded flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Username</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2 text-right">
                {u.role !== "ROLE_ADMIN" && (
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
