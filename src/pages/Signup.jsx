import { useState } from "react";
import { endpoints } from "../services/endpoint";
import networkRequest from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const signup = async () => {
    if (!form.name || !form.email || !form.password) {
      return alert("All fields are required ❌");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match ❌");
    }

    try {
      const res = await networkRequest({}).post(endpoints.SIGNUP, form);
      alert("Signup successful 🎉");
      console.log(res.data);
      window.location.href = "/login";
    } catch (err) {
      alert("Signup failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account 🚀
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          onClick={signup}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 shadow-md"
        >
          Sign Up
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-purple-600 cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
