import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [username, setUsername] = useState(null);  
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [submittedQuestions, setSubmittedQuestions] = useState({
    Dogs: [],
    Cats: [],
    Pizza: [],
  });
  const [replyInput, setReplyInput] = useState('');
  const [activeReplyIndex, setActiveReplyIndex] = useState(null);
  const navigate = useNavigate();

  const categories = [
    { name: 'Dogs', header: 'Questions About Dogs', description: 'Type in Your Questions Here:' },
    { name: 'Cats', header: 'Questions About Cats', description: 'Type in Your Questions Here:' },
    { name: 'Pizza', header: 'Questions About Pizza', description: 'Type in Your Questions Here:' },
  ];

  useEffect(() => {
    const loggedInUsername = localStorage.getItem('username');
    if (!loggedInUsername) {
      navigate('/login'); 
    } else {
      setUsername(loggedInUsername); 
    }
  }, [navigate]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setCurrentQuestion('');
    setActiveReplyIndex(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('username'); 
    navigate('/login');  
  };

  const handleQuestionChange = (event) => {
    setCurrentQuestion(event.target.value);
  };

  const handleQuestionSubmit = (event) => {
    event.preventDefault();
    if (currentQuestion.trim() && activeCategory) {
      setSubmittedQuestions((prevQuestions) => ({
        ...prevQuestions,
        [activeCategory.name]: [
          ...prevQuestions[activeCategory.name],
          { questionText: currentQuestion, replies: [] },
        ],
      }));
      setCurrentQuestion('');
    }
  };

  const handleDeleteQuestion = (category, index) => {
    const updatedQuestions = submittedQuestions[category].filter((_, i) => i !== index);
    setSubmittedQuestions((prevQuestions) => ({
      ...prevQuestions,
      [category]: updatedQuestions,
    }));
  };

  const handleReplyChange = (event) => {
    setReplyInput(event.target.value);
  };

  const handleReplySubmit = (category, questionIndex) => {
    if (replyInput.trim()) {
      const updatedQuestions = [...submittedQuestions[category]];
      updatedQuestions[questionIndex].replies = [
        ...updatedQuestions[questionIndex].replies,
        replyInput,
      ];

      setSubmittedQuestions((prevQuestions) => ({
        ...prevQuestions,
        [category]: updatedQuestions,
      }));
      setReplyInput('');
      setActiveReplyIndex(null);
    }
  };

  const handleDeleteReply = (category, questionIndex, replyIndex) => {
    const updatedQuestions = [...submittedQuestions[category]];
    updatedQuestions[questionIndex].replies = updatedQuestions[questionIndex].replies.filter((_, i) => i !== replyIndex);

    setSubmittedQuestions((prevQuestions) => ({
      ...prevQuestions,
      [category]: updatedQuestions,
    }));
  };

  const toggleReplyBox = (index) => {
    setActiveReplyIndex(index === activeReplyIndex ? null : index);
  };

  return (
    <div className="homeContainer">
      <header className="topBar">
        <div className="usernameDisplay">Welcome, {username}</div>
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
      </header>
      <nav className="sidebar">
        <h2>Questions</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.name} onClick={() => handleCategoryClick(category)}>
              {category.name}
            </li>
          ))}
        </ul>
      </nav>
      <div className="contentArea">
        {activeCategory ? (
          <>
            <h2>{activeCategory.header}</h2>
            <p>{activeCategory.description}</p>
            <form onSubmit={handleQuestionSubmit}>
              <textarea
                className="questionsBox"
                id="paragraph"
                name="paragraph"
                rows="3"
                cols="60"
                placeholder="Write your Questions here"
                value={currentQuestion}
                onChange={handleQuestionChange}
              />
              <input className="questionsSubmitButton" type="submit" value="Submit" />
            </form>
            <div className="submittedQuestions">
              <h3 className="submittedQuestionsTitle">Submitted Questions</h3>
              <ul>
                {submittedQuestions[activeCategory.name].map((question, index) => (
                  <li className="questionContainer" key={index}>
                    <div className="questionText">
                      {question.questionText}
                      <button className="deleteButton" onClick={() => handleDeleteQuestion(activeCategory.name, index)}>Delete</button>
                      <button className="replyButton" onClick={() => toggleReplyBox(index)}>Reply</button>
                    </div>

                    {/* Reply input box */}
                    {activeReplyIndex === index && (
                      <div className="replyInputContainer">
                        <textarea
                          className="replyInput"
                          rows="2"
                          cols="50"
                          placeholder="Write your reply here"
                          value={replyInput}
                          onChange={handleReplyChange}
                        />
                        <button className="submitReply" onClick={() => handleReplySubmit(activeCategory.name, index)}>Submit Reply</button>
                      </div>
                    )}

                    {/* Display replies */}
                    <ul className="repliesList">
                      {question.replies.map((reply, replyIndex) => (
                        <li key={replyIndex} className="replyItem">
                          {reply}
                          <button
                            className="deleteReplyButton"
                            onClick={() => handleDeleteReply(activeCategory.name, index, replyIndex)}
                          >
                            X
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p>Please select a category to see details.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
