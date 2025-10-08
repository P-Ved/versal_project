import React from 'react';

const Sidebar = ({ contacts, selectedContact, onContactSelect, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button className="close-sidebar" onClick={onClose}>×</button>
        </div>


        <div className="contacts-list">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
              onClick={() => onContactSelect(contact)}
            >
              <div className="contact-avatar">
                <span className="avatar-emoji">{contact.avatar}</span>
              </div>
              
              <div className="contact-content">
                <div className="contact-top-row">
                  <h3 className="contact-name">{contact.name}</h3>
                  {contact.time && <span className="contact-time">{contact.time}</span>}
                </div>
                {contact.lastMessage && (
                  <div className="contact-bottom-row">
                    <p className="last-message">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <span className="unread-badge">{contact.unread}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;