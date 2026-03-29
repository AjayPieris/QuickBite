import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (file) {
        formData.append("file", file);
      }

      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full border rounded-lg p-3"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full border rounded-lg p-3"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={6}
        />{" "}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">
            Profile Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-lg p-2 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>{" "}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Register
        </button>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
