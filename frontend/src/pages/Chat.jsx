import React, { useEffect, useState } from "react";
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket
} from "../services/socket";
import { getChatHistory, getAllUsers } from "../services/api";
import "../styles/chat.css";
import { useNavigate } from "react-router-dom";

function Chat() {

  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    disconnectWebSocket();
    navigate("/login");
  };

  // Load users
  useEffect(() => {
    getAllUsers().then(data => {
      setUsers(data.filter(u => u.username !== username));
    });
  }, [username]);

  // Load chat history
  useEffect(() => {
    if (!selectedUser) return;

    getChatHistory(username, selectedUser.username)
      .then(history => {
        setMessages(
          history.map(m => ({
            ...m,
            status: "delivered"
          }))
        );
      });
  }, [selectedUser, username]);

  // WebSocket
  useEffect(() => {
    if (!username) return;

    connectWebSocket(username, msg => {
      setMessages(prev => [...prev, { ...msg, status: "received" }]);
    });

    return () => disconnectWebSocket();
  }, [username]);

  if (!username) {
    return null;
  }

  const handleSend = () => {
    if (!message || !selectedUser) return;

    const msgData = {
      sender: username,
      receiver: selectedUser.username,
      content: message,
      status: "delivered"
    };

    sendMessage(msgData);
    setMessages(prev => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>Smart Chat</h2>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>

        {/* Users */}
        <div style={{ width: "25%" }}>
          <h3>Users</h3>
          {users.map(u => (
            <div
              key={u.username}
              onClick={() => setSelectedUser(u)}
              style={{
                padding: "10px",
                cursor: "pointer",
                background:
                  selectedUser?.username === u.username ? "#ddd" : "transparent",
                borderRadius: "6px"
              }}
            >
              {u.username} {u.online ? "🟢" : "🔴"}
            </div>
          ))}
        </div>

        {/* Chat */}
        <div style={{ width: "75%" }}>
          {selectedUser ? (
            <>
              <h3>Chat with {selectedUser.username}</h3>

              <div className="chat-container">
                {messages
                  .filter(msg => {
                    const sender =
                      msg.sender.username ? msg.sender.username : msg.sender;
                    const receiver =
                      msg.receiver?.username
                        ? msg.receiver.username
                        : msg.receiver;

                    return (
                      (sender === username &&
                        receiver === selectedUser.username) ||
                      (sender === selectedUser.username &&
                        receiver === username)
                    );
                  })
                  .map((msg, index) => {
                    const sender =
                      msg.sender.username ? msg.sender.username : msg.sender;
                    const isMe = sender === username;

                    return (
                      <div
                        key={index}
                        className={`message ${isMe ? "sent" : "received"}`}
                      >
                        <div className="message-text">
                          {msg.content}
                        </div>

                        {isMe && (
                          <div className="tick-container">✓✓</div>
                        )}
                      </div>
                    );
                  })}
              </div>

              <div className="input-container">
                <input
                  className="input-box"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button className="send-button" onClick={handleSend}>
                  ➤
                </button>
              </div>
            </>
          ) : (
            <h3>Select a user to start chatting</h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
