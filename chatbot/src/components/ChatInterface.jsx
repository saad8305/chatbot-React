import { useState, useEffect, useRef } from 'react';
import { knowledgeBase, quickReplies } from '../data/knowledgeBase';
import { useTheme } from '../context/ThemeContext';
import Fuse from 'fuse.js';

export default function ChatInterface() {
  const { theme, setTheme, themes } = useTheme();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const simulateTyping = (text, callback) => {
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        callback();
      }
    }, 15);
  };

  const findAnswer = (query) => {
    const fuse = new Fuse(knowledgeBase, {
      keys: ['keywords'],
      threshold: 0.4,
      distance: 100,
      includeScore: true
    });
    const result = fuse.search(query);
    if (result.length > 0 && result[0].score < 0.5) {
      return result[0].item.answer;
    }
    const fallbacks = [
      `متاسفانه پاسخ دقیقی برای "${query}" در دیتابیس من وجود ندارد، اما می‌توانم به شما کمک کنم تا آن را جستجو کنید.`,
      `سؤال خوبی پرسیدید! من در حال یادگیری هستم و به زودی بتوانم پاسخ بهتری بدهم.`,
      `در مورد "${query}" می‌توانم بگویم که این موضوع بسیار جالب است.`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    const userMsg = { type: 'user', text: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const answer = findAnswer(text);
    simulateTyping(answer, () => {
      const botMsg = { type: 'bot', text: answer };
      setMessages(prev => [...prev, botMsg]);
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clearChat = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید گفت‌وگو را پاک کنید؟')) {
      setMessages([]);
      localStorage.removeItem('chatMessages');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`خطا در حالت تمام‌صفحه: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div style={{
      maxWidth: isFullscreen ? 'none' : '700px',
      margin: isFullscreen ? '0' : '2rem auto',
      padding: isFullscreen ? '1rem' : '1rem',
      fontFamily: 'Vazirmatn, Tahoma, Arial, sans-serif',
      direction: 'rtl',
      backgroundColor: darkMode ? '#121212' : '#20b16dff',
      minHeight: '100vh',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: darkMode ? '#1e1e1e' : '#cdcb3eff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: darkMode ? '#ffffff' : '#000000ff',
          fontSize: '24px',
          fontWeight: '700',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '28px' }}>🤖</span>
          چت‌بات هوشمند
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={toggleFullscreen}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: darkMode ? '#ffffff' : '#555',
              padding: '6px 10px',
              borderRadius: '6px'
            }}
            title={isFullscreen ? 'خروج از حالت تمام‌صفحه' : 'حالت تمام‌صفحه'}
          >
            {isFullscreen ? '⛶' : '⛶'}
          </button>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: `1px solid ${darkMode ? '#444' : '#ccc'}`,
              backgroundColor: darkMode ? '#2d2d2d' : '#fff',
              color: darkMode ? '#fff' : '#333',
              fontSize: '14px'
            }}
          >
            {themes.map(t => (
              <option key={t} value={t}>
                {t === 'blue' ? 'آبی' : t === 'green' ? 'سبز' : 'بنفش'}
              </option>
            ))}
          </select>
          <button
            onClick={clearChat}
            style={{
              background: 'none',
              border: `1px solid ${darkMode ? '#000000ff' : '#ff4444'}`,
              color: darkMode ? '#ff6b6b' : '#ff4444',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            پاک‌سازی
          </button>
          <button
            onClick={toggleDarkMode}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: darkMode ? '#ffffff' : '#555',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background 0.3s',
              fontWeight: '600'
            }}
            onMouseEnter={e => e.target.style.backgroundColor = darkMode ? '#333' : '#eee'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            {darkMode ? '☀️ روشن' : '🌙 تیره'}
          </button>
        </div>
      </div>

      <div
        style={{
          height: isFullscreen ? 'calc(100vh - 180px)' : '500px',
          overflowY: 'auto',
          border: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
          borderRadius: '20px',
          padding: '20px',
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          marginBottom: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'background-color 0.3s ease'
        }}
      >
        {messages.length === 0 && (
          <>
            <div style={{
              color: darkMode ? '#aaa' : '#888',
              textAlign: 'center',
              marginTop: isFullscreen ? '40vh' : '200px',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              سؤال خود را بنویسید یا از پیشنهادات زیر استفاده کنید:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(reply)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: darkMode ? '#2d2d2d' : '#f1f8e9',
                    border: `1px solid ${darkMode ? '#444' : '#ccc'}`,
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = darkMode ? '#3a3a3a' : '#e0e0e0'}
                  onMouseLeave={e => e.target.style.backgroundColor = darkMode ? '#2d2d2d' : '#f1f8e9'}
                >
                  {reply}
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.type === 'user' ? 'right' : 'left',
              backgroundColor: msg.type === 'user'
                ? darkMode ? 'var(--bg-dark)' : 'var(--bg-light)'
                : darkMode ? '#2d2d2d' : '#f1f8e9',
              padding: '14px 18px',
              margin: '12px 0',
              borderRadius: '20px',
              maxWidth: '85%',
              marginLeft: msg.type === 'user' ? 'auto' : '0',
              marginRight: msg.type === 'user' ? '0' : 'auto',
              fontSize: '16px',
              lineHeight: '1.5',
              color: darkMode && msg.type === 'user' ? 'var(--text-dark)' : 'inherit',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              position: 'relative'
            }}
          >
            {msg.text}
            {msg.type === 'bot' && (
              <button
                onClick={() => copyToClipboard(msg.text)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: msg.type === 'user' ? 'auto' : '4px',
                  right: msg.type === 'user' ? '4px' : 'auto',
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: darkMode ? '#aaa' : '#777'
                }}
              >
                📋
              </button>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{
            textAlign: 'left',
            backgroundColor: darkMode ? '#2d2d2d' : '#f1f8e9',
            padding: '14px 18px',
            margin: '12px 0',
            borderRadius: '20px',
            maxWidth: '85%',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            در حال تایپ...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        direction: 'ltr',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="سؤال خود را وارد کنید..."
          style={{
            flex: 1,
            padding: '14px 20px',
            border: `1px solid ${darkMode ? '#444' : '#ccc'}`,
            borderRadius: '28px',
            fontSize: '16px',
            direction: 'rtl',
            outline: 'none',
            backgroundColor: darkMode ? '#2d2d2d' : '#fff',
            color: darkMode ? '#fff' : '#333',
            boxShadow: `0 2px 6px ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
            transition: 'border-color 0.3s, box-shadow 0.3s'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--primary-dark)'}
          onBlur={e => e.target.style.borderColor = darkMode ? '#444' : '#ccc'}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          style={{
            padding: '14px 28px',
            backgroundColor: !input.trim() 
              ? (darkMode ? '#444' : '#ccc') 
              : 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '28px',
            cursor: !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'background 0.3s, transform 0.2s',
            boxShadow: `0 2px 6px ${darkMode ? 'rgba(0,123,255,0.3)' : 'rgba(25,118,210,0.3)'}`,
            transform: 'scale(1)'
          }}
          onMouseEnter={e => {
            if (input.trim()) {
              e.target.style.backgroundColor = 'var(--primary-hover)';
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={e => {
            if (input.trim()) {
              e.target.style.backgroundColor = 'var(--primary)';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          ارسال
        </button>
      </div>
    </div>
  );
}