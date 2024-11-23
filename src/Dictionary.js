import React, { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const PIXABAY_API_KEY = "47145142-c0f64889c5b39f04c9aba5a7a";

const Dictionary = () => {
  const { isAuthenticated } = useAuth0();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const containerRef = useRef(null);

   useEffect(() => {
    const processRedirect = async () => {
      if (window.location.search.includes("code=") || window.location.search.includes("state=")) {
        try {
          await handleRedirectCallback(); // Xử lý callback Auth0
          window.history.replaceState({}, document.title, window.location.pathname); // Xóa query parameters
        } catch (error) {
          console.error("Error handling redirect callback:", error);
        }
      }
    };
    processRedirect();
  }, [handleRedirectCallback]);
  
  useEffect(() => {
    if (query) {
      fetchSuggestions(query);
      setShowHistory(false);
    } else {
      setSuggestions([]);
      setSelectedWord(null);
      setErrorMessage("");
    }
  }, [query]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`http://localhost:5000/search?q=${query}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchImage = async (query) => {
    try {
      const response = await axios.get(`https://pixabay.com/api/`, {
        params: {
          key: PIXABAY_API_KEY,
          q: query,
          image_type: "photo",
          per_page: 10,
        },
      });
      if (response.data.hits.length > 0) {
        setImage(response.data.hits[0].webformatURL);
      } else {
        setImage(null);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      setImage(null);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === "") return;

    try {
      const response = await axios.get(`http://localhost:5000/search?q=${query}`);
      if (response.data.length > 0) {
        const exactMatch = response.data.find(
          (word) => word.word.toLowerCase() === query.toLowerCase()
        );
        if (exactMatch) {
          setSelectedWord(exactMatch);
          setErrorMessage("");
          await fetchImage(exactMatch.word);

          setHistory((prevHistory) => {
            const updatedHistory = [exactMatch.word, ...prevHistory.filter((w) => w !== exactMatch.word)];
            return updatedHistory.slice(0, 10);
          });
        } else {
          setErrorMessage(`Không tìm thấy từ "${query}".`);
        }
      } else {
        setErrorMessage(`Không có kết quả cho từ "${query}".`);
        setSelectedWord(null);
        setImage(null);
      }
    } catch (error) {
      console.error("Error fetching word:", error);
    }

    setSuggestions([]);
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #FFDEE9, #B5FFFC)", // Gradient tươi sáng hơn
          boxShadow: "0 12px 25px rgba(0, 0, 0, 0.2)",
          color: "#3E3E3E",
          maxWidth: "650px",
          margin: "auto",
          marginTop: "100px",
          animation: "fadeInDown 1s ease-in-out",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Hiệu ứng background */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "150px",
            height: "150px",
            backgroundColor: "#FFD1DC",
            borderRadius: "50%",
            filter: "blur(50px)",
            zIndex: "-1",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "-50px",
            width: "200px",
            height: "200px",
            backgroundColor: "#C1EFFF",
            borderRadius: "50%",
            filter: "blur(70px)",
            zIndex: "-1",
          }}
        ></div>
  
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            marginBottom: "15px",
            textShadow: "0 3px 6px rgba(0, 0, 0, 0.25)",
          }}
        >
          Truy cập giới hạn!
        </h2>
        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#555555",
            fontWeight: "500",
            marginBottom: "30px",
          }}
        >
          Đăng nhập ngay để khám phá tất cả các tính năng tuyệt vời mà ứng dụng từ điển của chúng tôi mang lại. 
          Hãy nhấn vào nút đăng nhập ở phía trên!
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            animation: "bounceIn 1.5s ease",
          }}
        >
          <img
            src="https://img.icons8.com/clouds/120/lock.png"
            alt="Lock Icon"
            style={{
              width: "100px",
              height: "100px",
            }}
          />
        </div>
        {/* Hiệu ứng động */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "-2",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #FFDEE9, #FF9A9E)",
            opacity: "0.2",
            filter: "blur(120px)",
          }}
        ></div>
      </div>
    );
  }
  
  
  // const formatDefinition = (definition) => {
  //   const lines = definition.split('\n');
  //   return lines
  //     .map((line) => {
  //       if (line.startsWith('@')) {
  //         return `<div style="margin-left: 0px; font-weight: bold;">${line}</div>`;
  //       } else if (line.startsWith('*')) {
  //         return `<div style="margin-left: 20px;">${line}</div>`;
  //       } else if (line.startsWith('-')) {
  //         return `<div style="margin-left: 40px;">${line}</div>`;
  //       } else if (line.startsWith('+') || line.startsWith('=') || line.startsWith('!')) {
  //         return `<div style="margin-left: 60px;">${line}</div>`;
  //       }
  //       return `<div>${line}</div>`;
  //     })
  //     .join('');
  // };
  const formatContentWithLimit = (data) => {
    if (!data || typeof data !== 'string' || data.trim() === '') {
        console.error('Invalid input data:', data);
        return [];
    }

    const lines = data.split('\n');
    const blocks = [];
    let currentBlock = [];

    const categories = ['Chuyên ngành', 'Lĩnh vực'];

    lines.forEach((line) => {
        line = line.trim(); // Loại bỏ khoảng trắng đầu cuối
        if (line.startsWith('@')) {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock);
                currentBlock = [];
            }

            const isCategory = categories.some((cat) => line.includes(cat));
            if (isCategory) {
                currentBlock.push(line.replace('@', '').split(':')[0].trim());
            } else {
                const parts = line.replace('@', '').split(' ');
                if (parts.length > 1) {
                    const phonetic = parts.slice(1).join(' ').trim();
                    currentBlock.push(`Phiên âm: ${phonetic}`);
                }
            }
        } else if (line !== '') {
            currentBlock.push(line);
        }
    });

    if (currentBlock.length > 0) {
        blocks.push(currentBlock);
    }

    return blocks.map((block) => {
        const result = [];
        let countDash = 0;
        let specialChars = { '+': false, '=': false, '!': false };

        block.forEach((line) => {
            const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

            if (line.startsWith('Phiên âm:')) {
                result.push({ content: `<strong>${line}</strong>`, level: 0 });
                specialChars = { '+': false, '=': false, '!': false };
            } else if (categories.some((cat) => line.startsWith(cat))) {
                result.push({ content: `<strong>${line}</strong>`, level: 0 });
            } else if (line.startsWith('*')) {
                result.push({ content: '<strong>Từ loại:</strong> ' + capitalize(line.slice(1).trim()), level: 1 });
                countDash = 0;
                specialChars = { '+': false, '=': false, '!': false };
            } else if (line.startsWith('-') && countDash < 1) {
                result.push({ content: '<strong>Nghĩa:</strong> ' + capitalize(line.slice(1).trim()), level: 2 });
                countDash++;
            } else if (['+', '=', '!'].includes(line[0])) {
                const char = line[0];
                const parts = line.slice(1).trim().split('+').map((part) => capitalize(part.trim()));

                if (char === '=' && !specialChars['=']) {
                    result.push({ content: `<strong>Ví dụ tiếng Anh:</strong> ${parts[0]}`, level: 3 });
                    if (parts[1]) {
                        result.push({ content: `<strong>Ví dụ tiếng Việt:</strong> ${parts[1]}`, level: 3 });
                    }
                    specialChars['='] = true;
                } else if (char === '+' && !specialChars['+']) {
                    result.push({ content: `<strong>Ví dụ tiếng Việt:</strong> ${parts[0]}`, level: 3 });
                    specialChars['+'] = true;
                } else if (char === '!' && !specialChars['!']) {
                    result.push({ content: `<strong>Thành ngữ:</strong> ${parts[0]}`, level: 3 });
                    specialChars['!'] = true;
                }
            }
        });

        return result;
    });
};




  
  
  
  
  
  
  
  
  
  
  
  
  
const DisplayLimitedContent = ({ data }) => {
  const blocks = formatContentWithLimit(data);

  if (!blocks || blocks.length === 0) {
      return (
          <div style={{ fontFamily: 'Arial, sans-serif', color: '#999', textAlign: 'center' }}>
              Không có nội dung để hiển thị.
          </div>
      );
  }

  return (
      <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
          {blocks.map((block, index) => (
              block.length > 0 && (
                  <div
                      key={index}
                      style={{
                          marginBottom: '15px',
                          padding: '12px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          backgroundColor: '#f9f9f9',
                      }}
                  >
                      {block.map((line, lineIndex) => (
                          <div
                              key={lineIndex}
                              style={{
                                  marginLeft: `${20 * line.level}px`, // Thụt lề theo mức
                                  fontSize: line.level === 0 ? '18px' : '16px', // Cỡ chữ nhỏ hơn
                                  fontWeight: line.level === 0 ? 'bold' : 'normal',
                                  color: line.level === 0 ? '#007BFF' : line.level === 1 ? '#5A6268' : '#495057',
                              }}
                              dangerouslySetInnerHTML={{
                                  __html: line.content.charAt(0).toUpperCase() + line.content.slice(1),
                              }} // Viết hoa chữ cái đầu tiên
                          ></div>
                      ))}
                  </div>
              )
          ))}
      </div>
  );
};



  
  
  
  

  
  const handleSelectWord = async (word) => {
    setSelectedWord(word);
    setQuery(word.word);
    setSuggestions([]);
    setErrorMessage('');
    await fetchImage(word.word);

    setHistory((prevHistory) => {
      const updatedHistory = [word.word, ...prevHistory.filter((w) => w !== word.word)];
      return updatedHistory.slice(0, 10); // Lưu tối đa 10 từ
    });
  };

  const handleSpeak = () => {
    if (selectedWord) {
      const utterance = new SpeechSynthesisUtterance(selectedWord.word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
    ref={containerRef}
  style={{
    maxWidth: '800px',
    margin: 'auto',
    fontFamily: "'Roboto', sans-serif",
    padding: '40px 20px',
    color: '#333',
    backgroundColor: '#F5F7FA',
    borderRadius: '12px', // Bo góc cho khung chính
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', // Đổ bóng tinh tế
    animation: 'fadeIn 1s ease', // Hiệu ứng xuất hiện
  }}
>
  {/* Header */}
  <div
    style={{
      textAlign: 'center',
      marginBottom: '30px',
      animation: 'bounceIn 1.2s ease', // Hiệu ứng bật vào
    }}
  >
    <h1
      style={{
        fontSize: '54px',
        fontWeight: 'bold',
        marginBottom: '10px',
        background: 'linear-gradient(to right, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      Your Word Assistant
    </h1>
    <p
      style={{
        fontSize: '18px',
        color: '#6c757d',
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      Search for definitions, meanings, and more in style!
    </p>
  </div>

  {/* Search Form Wrapper */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '40px',
    }}
  >
    <form
      onSubmit={handleSearch}
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        maxWidth: '700px',
        backgroundColor: '#FFFFFF',
        borderRadius: '25px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
    >
      <input
        type="text"
        placeholder="Type a word..."
        value={query}
        onFocus={() => !query && setShowHistory(true)}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex: 1,
          padding: '15px 20px',
          fontSize: '18px',
          border: 'none',
          outline: 'none',
          fontFamily: "'Roboto', sans-serif",
          color: '#495057',
        }}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          style={{
            position: 'absolute',
            right: '115px', // Điều chỉnh khoảng cách phù hợp
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6c757d',
            height: '30px',
            width: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.3s ease',
            zIndex: 10, // Đảm bảo nút "X" nằm phía trên
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#495057'; // Đậm hơn khi hover
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#6c757d';
          }}
        >
          ✖
        </button>
      )}
      <button
        type="submit"
        style={{
          backgroundColor: '#667eea',
          color: '#FFFFFF',
          padding: '15px 30px',
          fontSize: '18px',
          border: 'none',
          borderRadius: '0 25px 25px 0',
          cursor: 'pointer',
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#5b6ede';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#667eea';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Search
      </button>
    </form>
  </div>
  {errorMessage && (
  <div
    style={{
      marginTop: '30px',
      padding: '20px 30px',
      borderRadius: '16px',
      background: 'linear-gradient(90deg, #ff9a9e, #fad0c4)', // Gradient pastel nhẹ
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
      color: '#FFFFFF',
      textAlign: 'center',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 'bold',
      fontSize: '18px',
      maxWidth: '600px',
      margin: 'auto',
      animation: 'fadeIn 0.8s ease-in-out',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '10px',
      }}
    >
      <span
        style={{
          fontSize: '24px',
          animation: 'bounce 1.5s infinite',
        }}
      >
        😔
      </span>
      <span
        style={{
          fontSize: '22px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        No Results Found!
      </span>
    </div>
    <p
      style={{
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#FFEDE9',
        lineHeight: '1.5',
      }}
    >
      We couldn't find any results for "<span style={{ textDecoration: 'underline' }}>{query}</span>".<br />
      Please try another word or check your spelling.
    </p>
  </div>
)}


  {/* Search History */}
  {showHistory && history.length > 0 && (
  <ul
    style={{
      width: '600px',
      listStyleType: 'none',
      margin: '30px auto', // Tăng khoảng cách bên trên và dưới
      padding: '15px', // Tăng khoảng cách bên trong
      border: '1px solid rgba(211, 228, 205, 0.6)', // Viền pastel
      borderRadius: '12px', // Bo góc toàn bộ danh sách
      backgroundColor: '#EFF8F2', // Nền xanh nhạt pastel
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ
      maxHeight: '250px',
      overflowY: 'auto', // Chỉ cuộn dọc
      overflowX: 'hidden', // Loại bỏ cuộn ngang
    }}
  >
    <h3
      style={{
        margin: '10px 15px',
        color: '#4A7050',
        fontSize: '18px',
        fontWeight: '600',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      Search History
    </h3>
    {history.map((word, index) => (
      <li
        key={index}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
          marginBottom: '10px',
          cursor: 'pointer',
          backgroundColor: index % 2 === 0 ? '#F6FFFA' : '#E3FCEF',
          borderRadius: '10px',
          color: '#495057',
          fontSize: '16px',
          fontWeight: '500',
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease, background-color 0.4s ease, box-shadow 0.4s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'; // Phóng to nhẹ
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)'; // Bóng đổ rõ hơn
          e.currentTarget.style.backgroundColor = '#D1FADF'; // Đổi màu nền khi hover
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.backgroundColor =
            index % 2 === 0 ? '#F6FFFA' : '#E3FCEF'; // Trả lại màu nền gốc
        }}
        onClick={() => {
          setQuery(word); // Cập nhật giá trị từ được chọn
          handleSearch({ preventDefault: () => {} }); // Thực hiện tìm kiếm
        }}
      >
        <span>{word}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
            const updatedHistory = history.filter((_, i) => i !== index); // Xóa mục khỏi danh sách
            setHistory(updatedHistory); // Cập nhật lại lịch sử
          }}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '16px',
            color: '#FF6B6B',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, color 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#FF4A4A'; // Hover màu đỏ đậm hơn
            e.currentTarget.style.transform = 'rotate(15deg) scale(1.2)'; // Xoay và phóng to nút
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#FF6B6B';
            e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; // Trả lại trạng thái bình thường
          }}
        >
          ✖
        </button>
      </li>
    ))}
  </ul>
)}






{suggestions.length > 0 && (
  <ul
    style={{
      width: '583px',
      listStyleType: 'none',
      margin: '10px auto',
      padding: '10px',
      border: '1px solid #F7D1D1', // Viền nhẹ pastel
      borderRadius: '12px', // Bo góc toàn bộ thanh
      backgroundColor: '#FFF4F4', // Nền chính pastel nhạt
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Hiệu ứng đổ bóng
      maxHeight: '200px',
      overflowY: 'auto',
    }}
  >
    {suggestions.map((word, index) => (
      <li
        key={index}
        onClick={() => handleSelectWord(word)}
        style={{
          padding: '12px 15px', // Khoảng cách trong mục
          marginBottom: '8px', // Khoảng cách giữa các mục
          cursor: 'pointer',
          background: `linear-gradient(120deg, ${
            index % 3 === 0 ? '#FFDEE9, #B5FFFC' : index % 3 === 1 ? '#FFF1C1, #FDDAC5' : '#D4FCFF, #BDE4FF'
          })`, // Gradient màu pastel xen kẽ
          borderRadius: '8px', // Bo góc từng mục
          color: '#5A5A5A', // Màu chữ
          fontSize: '16px',
          fontWeight: '500', // Đậm nhẹ
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.05)', // Đổ bóng từng mục
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease', // Hiệu ứng mượt
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)'; // Tăng bóng khi hover
          e.currentTarget.style.transform = 'scale(1.03)'; // Tăng nhẹ kích thước
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.05)'; // Trở về bóng ban đầu
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {word.word}
      </li>
    ))}
  </ul>
)}




  {/* Selected Word Details */}
  {selectedWord && (
    <div
    style={{
      marginTop: '20px',
      padding: '30px',
      borderRadius: '16px',
      backgroundColor: 'white',
      border: '2px solid #E0F7FA', // Viền pastel xanh nhạt
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: 'auto',
    }}
  >
    {/* Phần tiêu đề từ */}
    <h2
      style={{
        fontSize: '36px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: "'Poppins', sans-serif",
        background: 'linear-gradient(90deg, #43cea2, #185a9d)', // Gradient xanh lam và xanh lá
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {selectedWord.word}
      <button
        onClick={handleSpeak}
        style={{
          marginLeft: '10px',
          backgroundColor: 'white',
          border: '2px solid #43cea2',
          cursor: 'pointer',
          padding: '10px',
          borderRadius: '50%',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          boxShadow: '0 4px 8px rgba(67, 206, 162, 0.3)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(67, 206, 162, 0.5)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(67, 206, 162, 0.3)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <img
          src="https://img.icons8.com/ios-filled/50/43cea2/speaker.png"
          alt="Speaker Icon"
          title="Play Audio"
          style={{
            width: '24px',
            height: '24px',
          }}
        />
      </button>
    </h2>
      {errorMessage && (
    <div
      style={{
        marginTop: '30px',
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(90deg, #FF9A8B, #FF6A88, #FF99AC)', // Gradient đỏ hồng
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 'bold',
        fontSize: '18px',
        maxWidth: '600px',
        margin: 'auto', // Căn giữa
        animation: 'fadeIn 0.8s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <img
          src="https://img.icons8.com/emoji/48/sad-emoji.png"
          alt="Sad Face"
          style={{
            width: '32px',
            height: '32px',
            animation: 'shake 1s ease infinite',
          }}
        />
        Oops! We couldn't find any results for "<span style={{ textDecoration: 'underline' }}>{query}</span>".
      </div>
      <p style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'normal' }}>
        Please try another word or check your spelling.
      </p>
    </div>
  )}

    {/* Hình ảnh minh họa */}
    {image && (
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img
          src={image}
          alt={selectedWord.word}
          style={{
            maxWidth: '100%',
            width: '450px',
            borderRadius: '20px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.1)';
          }}
        />
        <p
          style={{
            marginTop: '10px',
            fontSize: '14px',
            color: '#666',
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Image source: Pixabay
        </p>
      </div>
    )}
  
    {/* Nội dung định nghĩa */}
    <DisplayLimitedContent
      data={selectedWord.definition}
      style={{
        marginTop: '20px',
        fontFamily: "'Roboto', sans-serif",
        lineHeight: '1.8',
        color: '#495057',
      }}
    />
  </div>
  
   
   
    
  )}
</div>

  );  
};

export default Dictionary;
