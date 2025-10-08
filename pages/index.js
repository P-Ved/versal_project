import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

// Dummy contact data
const contacts = [
  {
    id: 1,
    name: 'Dhruv',
    avatar: '👩‍💼',
    lastMessage: '',
    time: '',
    unread: 0
  },
  {
    id: 2,
    name: 'Vatsal',
    avatar: '👨‍💻',
    lastMessage: '',
    time: '',
    unread: 0
  },
  {
    id: 3,
    name: 'Om',
    avatar: '👩‍🎨',
    lastMessage: '',
    time: '',
    unread: 0
  },
  {
    id: 4,
    name: 'Parth',
    avatar: '👨‍🔬',
    lastMessage: '',
    time: '',
    unread: 0
  },
  {
    id: 5,
    name: 'Lax',
    avatar: '👩‍🏫',
    lastMessage: '',
    time: '',
    unread: 0
  },
  
];

// Initial messages for each contact
const initialMessages = {
  1: [
    { id: 1, text: 'Hey, how are you doing?', sender: 'contact', time: '2:25 PM', status: 'received' },
    { id: 2, text: 'I\'m good! Just working on some projects.', sender: 'user', time: '2:27 PM', status: 'sent' },
    { id: 3, text: 'That sounds interesting! What kind of projects?', sender: 'contact', time: '2:28 PM', status: 'received' },
  ],
  2: [
    { id: 1, text: 'Can we schedule a meeting?', sender: 'contact', time: '1:40 PM', status: 'received' },
    { id: 2, text: 'Sure! How about tomorrow at 3 PM?', sender: 'user', time: '1:42 PM', status: 'sent' },
  ],
  3: [
    { id: 1, text: 'Thanks for your help!', sender: 'contact', time: '12:10 PM', status: 'received' },
    { id: 2, text: 'You\'re welcome! Happy to help anytime.', sender: 'user', time: '12:12 PM', status: 'sent' },
  ],
  4: [
    { id: 1, text: 'See you tomorrow', sender: 'contact', time: '11:25 AM', status: 'received' },
    { id: 2, text: 'Looking forward to it!', sender: 'user', time: '11:27 AM', status: 'sent' },
  ],
  5: [
    { id: 1, text: 'Great presentation today!', sender: 'contact', time: '10:15 AM', status: 'received' },
    { id: 2, text: 'Thank you! I put a lot of effort into it.', sender: 'user', time: '10:17 AM', status: 'sent' },
    { id: 3, text: 'It really showed! The data visualization was excellent.', sender: 'contact', time: '10:18 AM', status: 'received' },
  ]
};

export default function Home() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [contactsData, setContactsData] = useState(contacts);
  const selectedContactRef = useRef(null);

  // Helper: compute last message preview/time for a contact thread
  const getLastPreview = (thread = []) => {
    if (!thread || thread.length === 0) return { lastMessage: '', time: '' };
    const last = thread[thread.length - 1];
    return { lastMessage: last.text, time: last.time };
  };

  // Helper: update one contact's preview/time and optionally unread count
  const updateContactPreview = (contactId, { text, time }, options = {}) => {
    const { incrementUnread = false, resetUnread = false } = options;
    setContactsData(prev => prev.map(c => {
      if (c.id !== contactId) return c;
      const next = { ...c, lastMessage: text, time };
      if (resetUnread) next.unread = 0;
      if (incrementUnread) next.unread = (c.unread || 0) + 1;
      return next;
    }));
  };

  // Function to handle contact selection and clear unread badge
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    selectedContactRef.current = contact;
    setSidebarOpen(false); // Close sidebar on mobile
    
    // Clear unread badge for selected contact
    if (contact.unread > 0) {
      setContactsData(prev => 
        prev.map(c => 
          c.id === contact.id ? { ...c, unread: 0 } : c
        )
      );
    }
  };

  // Auto-select first contact on load
  useEffect(() => {
    if (contactsData.length > 0) {
      handleContactSelect(contactsData[0]);
    }
  }, []);

  // On mount, derive last message previews for all contacts from initial messages
  useEffect(() => {
    setContactsData(prev => prev.map(c => {
      const { lastMessage, time } = getLastPreview(messages[c.id]);
      return { ...c, lastMessage, time };
    }));
  }, []);

  // Handle sending a new message
  const sendMessage = (messageText) => {
    if (!selectedContact || !messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));

    // Update sidebar preview for the selected contact
    updateContactPreview(selectedContact.id, { text: newMessage.text, time: newMessage.time }, { resetUnread: true });

    // Simulate bot typing and response
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);

    setTimeout(() => {
      setIsTyping(false);
      const botResponses = [
        "That's interesting!",
        "I understand what you mean.",
        "Thanks for sharing that with me.",
        "Could you tell me more about that?",
        "That sounds great!",
        "I agree with you on that.",
        "Let me think about that for a moment.",
        "That's a good point!"
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'contact',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'received'
      };

      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), botMessage]
      }));

      // If user has navigated away before bot responds, increment unread; otherwise reset
      const isStillOnThisChat = selectedContactRef.current?.id === selectedContact.id;
      updateContactPreview(
        selectedContact.id,
        { text: botMessage.text, time: botMessage.time },
        { incrementUnread: !isStillOnThisChat, resetUnread: isStillOnThisChat }
      );
    }, 3000);
  };

  return (
    <div className="chat-app">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="chat-container">
        <Sidebar 
          contacts={contactsData}
          selectedContact={selectedContact}
          onContactSelect={handleContactSelect}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <ChatWindow 
          contact={selectedContact}
          messages={messages[selectedContact?.id] || []}
          onSendMessage={sendMessage}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
}