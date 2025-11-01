import { useEffect, useRef, useState } from "react";
import { useSocket } from "../socket/socket";

export default function ChatRoom({ username, onLogout }) {
  const {
    messages,
    users,
    typingUsers,
    sendMessage,
    setTyping,
    sendPrivateMessage,
    socket,
  } = useSocket();

  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Ask server for page 1 of messages
    socket.emit("get_messages", { page: 1 }, (fetchedMessages) => {
      console.log("Loaded messages:", fetchedMessages);
    });
  }, []);

  // Notification on new message
  useEffect(() => {
    if (Notification.permission === "granted") {
      const last = messages[messages.length - 1];
      if (last && last.sender !== username && !last.system) {
        new Notification(`${last.sender}`, { body: last.message });
      }
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (selectedUser) sendPrivateMessage(selectedUser.id, input);
    else
      sendMessage(
        { message: input },
        (ack) => console.log("Message delivery:", ack)
      );

    setInput("");
    setTyping(false);
  };

  const handleReaction = (messageId, emoji) => {
    socket.emit("react_message", { messageId, reaction: emoji });
  };

  return (
    <div className="w-full max-w-6xl flex flex-col md:flex-row bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 border-r border-gray-700 p-4">
        <h2 className="font-bold text-lg mb-2">Online Users</h2>
        <ul className="space-y-2 overflow-y-auto max-h-[80vh]">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`cursor-pointer p-2 rounded ${
                selectedUser?.id === user.id
                  ? "bg-blue-600"
                  : "hover:bg-gray-700"
              }`}
            >
              {user.username}{" "}
              {typingUsers.includes(user.username) && (
                <span className="text-sm text-gray-400">(typing...)</span>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={onLogout}
          className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700 w-full"
        >
          Logout
        </button>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">
            {selectedUser
              ? `Private chat with ${selectedUser.username}`
              : "Global Chat Room"}
          </h2>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-gray-700 text-sm px-3 py-1 rounded"
          >
            Load older
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 bg-gray-900 p-4 rounded-lg">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 ${
                msg.sender === username ? "text-right" : "text-left"
              }`}
            >
              {msg.system ? (
                <p className="text-gray-500 italic">{msg.message}</p>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-1">
                    {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                  <div className="inline-block bg-gray-700 px-3 py-2 rounded-lg">
                    {msg.message}
                  </div>
                  <div className="flex gap-2 text-sm mt-1 justify-end">
                    {["👍", "❤️", "😂"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(msg.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <form onSubmit={handleSend} className="flex">
          <input
            type="text"
            className="flex-1 p-2 rounded-l bg-gray-700 focus:outline-none"
            placeholder={
              selectedUser
                ? `Message ${selectedUser.username}...`
                : "Type a message..."
            }
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setTyping(true);
            }}
            onBlur={() => setTyping(false)}
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
