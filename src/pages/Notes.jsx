import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let role = "viewer";
  let userId = null;
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedJson = atob(payloadBase64);
      const decodedPayload = JSON.parse(decodedJson);
      role = decodedPayload.role || "viewer";
      userId = decodedPayload.id || null;
    } catch (err) {
      console.error("Failed to parse token payload", err);
    }
  }

  const canEdit = role === "admin" || role === "editor";

  const canModifyNote = (note) => {
    if (role === "admin") return true;
    if (role === "editor" && note.owner_id === userId) return true;
    return false;
  };

  const fetchNotes = async () => {
    try {
      const headers = token ? { authorization: `Bearer ${token}` } : {};
      const res = await axios.post("http://localhost:5000/getNotes", {}, { headers });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Save or Update Note
  const saveNote = async () => {
    if (!form.title || !form.content) {
      return alert("All fields required ❌");
    }

    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:5000/updateNote/${editingId}`,
          form,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setNotes(notes.map((n) => (n.id === editingId ? res.data : n)));
        setEditingId(null);
      } else {
        const res = await axios.post(
          "http://localhost:5000/createNote",
          form,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setNotes([res.data, ...notes]);
      }

      setForm({ title: "", content: "" });
    } catch (err) {
      console.error(err);
      alert("Error saving note ❌");
    }
  };

  // ✅ Delete Note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deleteNote/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting note ❌");
    }
  };

  // ✅ Edit Note
  const editNote = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note.id);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, {
        headers: { authorization: `Bearer ${token}` }
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error logging out ❌");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white/40 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            📝 My Notes
          </h1>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-indigo-200 shadow-sm">
            {role}
          </span>
        </div>
        {token ? (
          <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-white text-rose-600 border border-rose-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-rose-50 hover:border-rose-300 hover:shadow transition-all active:scale-95 flex items-center gap-2"
          >
            <span>🚪</span> Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow transition-all active:scale-95 flex items-center gap-2"
          >
            <span>🔑</span> Login
          </button>
        )}
      </div>

      {/* ✅ FIXED: Properly closed form block */}
      {canEdit && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? "Edit Note" : "Create a Note"}
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={form.title}
            className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Write your note..."
            value={form.content}
            rows="4"
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
          />

          <div className="flex gap-2">
            <button
              onClick={saveNote}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {editingId ? "🔄 Update Note" : "➕ Add Note"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: "", content: "" });
                }}
                className="w-1/3 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col"
            >
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-800 mb-2 break-words">
                  {note.title}
                </h3>

                <div className="flex flex-col gap-1 text-xs text-gray-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-semibold">
                    👤 {note.owner_name || "Unknown"}
                  </span>
                  <span className="text-[11px]">
                    🕒 Created:{" "}
                    {note.created_at
                      ? new Date(note.created_at).toLocaleString()
                      : "N/A"}
                  </span>

                  {note.updated_at &&
                    note.updated_at !== note.created_at && (
                      <span className="text-[11px]">
                        🔄 Updated:{" "}
                        {new Date(note.updated_at).toLocaleString()}
                      </span>
                    )}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 flex-grow whitespace-pre-wrap break-words">
                {note.content}
              </p>

              {canModifyNote(note) && (
                <div className="flex justify-end gap-2 mt-auto border-t pt-4">
                  <button
                    onClick={() => editNote(note)}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition text-sm font-semibold"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => deleteNote(note.id)}
                    className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            {notes.length === 0 ? "No notes yet 😔" : "No matching notes found 😔"}
          </p>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-semibold bg-rose-500 text-white hover:bg-rose-600 shadow-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}