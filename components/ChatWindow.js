import React, { useState, useEffect, useRef } from 'react';

const ChatWindow = ({ contact, messages, onSendMessage, isTyping }) => {
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
      setShowEmojiPicker(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Emoji picker
  const emojis = ['😀','😃','😄','😁','😆','😊','😍','😘','😉','😎','🤔','😴','😢','😂','👍','👏','🙏','🎉'];
  const toggleEmojiPicker = () => setShowEmojiPicker(v => !v);
  const addEmoji = (emoji) => {
    setMessageInput(prev => prev + emoji);
  };

  if (!contact) {
    return (
      <div className="chat-window">
        <div className="no-contact-selected">
          <div className="no-contact-content">
            <span className="no-contact-icon">💬</span>
            <h3>Welcome to ChitChatty</h3>
            <p>Select a contact from the sidebar to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Chat header */}
      <div className="chat-header">
        <div className="contact-info">
          <div className="contact-avatar">
            <span className="avatar-emoji">{contact.avatar}</span>
          </div>
          <div className="contact-details">
            <h3 className="contact-name">{contact.name}</h3>
            <p className="contact-status">Online</p>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="messages-container" ref={chatContainerRef}>
        <div className="messages-list">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`message-wrapper ${message.sender === 'user' ? 'sent' : 'received'}`}
            >
              <div className="message-bubble">
                <p className="message-text">{message.text}</p>
                <div className="message-meta">
                  <span className="message-time">{message.time}</span>
                  {message.sender === 'user' && (
                    <span className={`message-status ${message.status}`}>
                      {message.status === 'sent' ? '✓' : '✓✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="message-wrapper received">
              <div className="message-bubble typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="message-input-container">
        <form onSubmit={handleSubmit} className="message-form">
          <div className="input-wrapper">
            <div className="emoji-wrapper" ref={emojiPickerRef}>
              <button type="button" className="emoji-btn" title="Choose emoji" onClick={toggleEmojiPicker}>😊</button>
              {showEmojiPicker && (
                <div className="emoji-picker">
                  {emojis.map((e) => (
                    <button key={e} type="button" className="emoji-item" onClick={() => addEmoji(e)}>{e}</button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="message-input"
            />
          </div>
          <button type="submit" className="send-btn" disabled={!messageInput.trim()} title="Send message">
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;