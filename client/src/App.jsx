import { useState } from "react";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";
import { useSocket } from "./socket/socket";

function App() {
  const { connect, disconnect, isConnected } = useSocket();
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (name) => {
    setUsername(name);
    connect(name);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    disconnect();
    setLoggedIn(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatRoom username={username} onLogout={handleLogout} isConnected={isConnected} />
      )}
    </div>

    
  );
}

export default App;
