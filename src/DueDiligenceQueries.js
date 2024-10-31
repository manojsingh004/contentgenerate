import React, { useState, useContext } from "react";
import { ChatContext } from './DataContext/ChatContext'; // Import the context
import Plus from './Plus'; 
import Save from './Save'; 
import Minus from './Minus';

const DueDiligenceQueries = (props) => {
  const { questions: contextQuestions, handleSetQuestions } = useContext(ChatContext); // Use context
  const [questions, setQuestions] = useState(contextQuestions || []);
  const [newQuestion, setNewQuestion] = useState({
    area_of_practice_id: 0,
    document_type_id: 0,
    id: Math.random().toString(36).slice(2),
    questions: "",
    newQuestion: true,
  });

  const handleNewQuestionChange = (e) => {
    setNewQuestion((current) => ({
      ...current,
      questions: e.target.value,
    }));
  };

  const handleAddQuestion = () => {
    if (newQuestion.questions.trim()) {
      const updatedQuestions = [...questions, newQuestion];
      setQuestions(current=>updatedQuestions); // Update local state
      handleSetQuestions(updatedQuestions); // Save to context
      setNewQuestion({
        area_of_practice_id: 0,
        document_type_id: 0,
        id: Math.random().toString(36).slice(2),
        questions: "",
        newQuestion: true,
      });
    }
  };

  const handleRemoveQuestion = (id) => {
    const updatedQuestions = questions.filter((question) => question.id !== id);
    setQuestions(updatedQuestions); // Update local state
    handleSetQuestions(updatedQuestions); // Save to context
  };

  const handleSaveQuestions =  () => {
    // try {
    //   const response = await fetch('/api/save-questions', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ questions }),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to save questions');
    //   }

    //   //alert('Questions saved successfully!');
    // } catch (error) {
    //   console.error('Error saving questions:', error);
    //  // alert('An error occurred while saving questions.');
    // }
    if (newQuestion.questions.trim()) {
      const updatedQuestions = [...questions, newQuestion];
      setQuestions(current=>updatedQuestions); // Update local state
      handleSetQuestions(updatedQuestions); // Save to context
      setNewQuestion({
        area_of_practice_id: 0,
        document_type_id: 0,
        id: Math.random().toString(36).slice(2),
        questions: "",
        newQuestion: true,
      });
      
    }
    console.log(questions)
  };

  return (
    <div>
      {/* List of Questions */}
      <ul style={{ listStyle: "none", padding: "0" }}>
        {questions.map((question, index) => (
          <li
            key={index}
            style={{
              width: "100%",
              height: "46px",
              border: "1px solid rgba(207, 212, 217, 1)",
              alignItems: "center",
              color: "rgba(117, 120, 139, 1)",
              fontSize: "14px",
              fontWeight: "400",
              borderRadius: "4px",
              display: "flex",
              padding: "20px 20px",
              marginBottom: "16px",
            }}
          >
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <span>{question.questions}</span>
              {question.newQuestion !== undefined && (
                <span 
                  style={{ cursor: "pointer", color: "red" }} 
                  onClick={() => handleRemoveQuestion(question.id)}
                >
                  <Minus />
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Input for New Question */}
      <input
        type="text"
        placeholder="Add a new question"
        style={{
          width: "100%",
          height: "46px",
          border: "1px solid rgba(207, 212, 217, 1)",
          alignItems: "center",
          color: "rgba(117, 120, 139, 1)",
          fontSize: "14px",
          fontWeight: "400",
          borderRadius: "4px",
          display: "flex",
          padding: "20px 20px",
          marginBottom: "16px",
        }}
        value={newQuestion.questions} // Bind the input to the `questions` field of newQuestion
        onChange={handleNewQuestionChange} // Update the question's text
      />

      {/* Add Question and Save Buttons */}
      <div
        style={{
          width: "100%",
          height: "46px",
          border: "1px solid rgba(207, 212, 217, 1)",
          alignItems: "center",
          color: "rgba(117, 120, 139, 1)",
          fontSize: "14px",
          backgroundColor: 'transparent',
          fontWeight: "400",
          color: '#4B57D3',
          borderRadius: "4px",
          display: "flex",
          padding: "20px 20px",
          justifyContent: "space-between",
          marginBottom: "16px",
          cursor: 'pointer'
        }}
      >
        <div onClick={handleAddQuestion}>
          <span style={{ marginRight: "10px" }}><Plus /></span>
          Add Question
        </div>
        <div style={{ color: '#3BAE46', cursor: 'pointer' }} onClick={handleSaveQuestions}>
          <span style={{ marginRight: "10px" }}><Save /></span>
          Save Custom Questions
        </div>
      </div>
    </div>
  );
};

export default DueDiligenceQueries;