import React, { useState } from 'react';
import './Chatbot.css';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        // call your backend API here to get the bot's response
        const botResponse = await fetchBotResponse(input);
        setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    };

    const fetchBotResponse = async (message: string) => {
        const response = await fetch('http://localhost:3000/generate-notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        const data = await response.json();
        return data.formattedNotes || "I'm not sure how to respond to that.";

    };

    return (
        <div className="chatbot-container">
            <div className="chatbox">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'
                            }`}
                    >
                        {message.text}
                    </div>

                ))}
            </div>
            <form className='input-form' onSubmit={handleSend}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    )
}

export default Chatbot;

