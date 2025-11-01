import { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onLogin(name);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm text-center shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Join the Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none"
          placeholder="Enter your username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 w-full">
          Join Chat
        </button>
      </form>
    </div>
  );
}
