import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Assuming axios is used to fetch data
import { DigiContext } from '../../context/DigiContext';
import { URL } from '../../Helper/handle-api';

const HeaderChat = () => {
  const { isChatDropdownOpen, toggleChatDropdown } = useContext(DigiContext);
  const chatDropdownRef = useRef(null);
  const [messages, setMessages] = useState([]);

  // Fetch messages from the backend when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${URL}/notification/requests`); // Update with your API endpoint
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target)) {
        toggleChatDropdown();
      }
    };

    if (isChatDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatDropdownOpen, toggleChatDropdown]);

  // Function to handle message deletion
  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`${URL}/notification/requests/${id}`);
      setMessages((prevMessages) => prevMessages.filter((message) => message._id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="header-btn-box" ref={chatDropdownRef}>
      <button
        className={`header-btn ${isChatDropdownOpen ? 'show' : ''}`}
        id="messageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded={isChatDropdownOpen}
        onClick={toggleChatDropdown}
      >
        <i className="fa-light fa-comment-dots"></i>
        <span className="badge bg-danger">{messages.length}</span>
      </button>
      <ul
        className={`message-dropdown dropdown-menu ${
          isChatDropdownOpen ? 'show' : ''
        }`}
        aria-labelledby="messageDropdown"
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <li key={message._id} className="d-flex justify-content-between">
              <Link to="#" className="d-flex">
                <div className="msg-txt">
                  <span className="name">{message.shopName}</span>
                  <span className="name">{message.productId}</span>
                  <span className="msg-short">{message.message}</span>
                  <span className="time">{new Date(message.createdAt).toLocaleTimeString()}</span>
                </div>
              </Link>
              <button
                className="close-btn"
                onClick={() => handleDeleteMessage(message._id)}
              >
                &times;
              </button>
            </li>
          ))
        ) : (
          <li>
            <span className="msg-txt">No messages</span>
          </li>
        )}
        <li>
          <Link to="#" className="show-all-btn">
            Show all messages
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderChat;
