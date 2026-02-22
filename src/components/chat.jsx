import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  async function sendMessage() {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    setReply(data.reply);
  }

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Claude something..."
      />
      <button onClick={sendMessage}>Send</button>
      {reply && <p>{reply}</p>}
    </div>
  );
}
