import React, { useState } from "react";
import Plus from './Plus'; 
import Save from './Save'; 
import Minus from './Minus';

const DueDiligenceQueries = (props) => {
  const [questions, setQuestions] = useState(props.questions || []);
  const [newQuestion, setNewQuestion] = useState({
    area_of_practice_id: 0,
    document_type_id: 0,
    id: Math.random().toString(36).slice(2), // Unique ID for each question
    questions: "",
    newQuestion: true, // Indicates a new question
  });

  // Update the new question's text based on user input
  const handleNewQuestionChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      questions: e.target.value, // Only update the question field
    });
  };

  // Handle adding a new question to the list
  const handleAddQuestion = () => {
    if (newQuestion.questions.trim()) {
      setQuestions([...questions, newQuestion]); // Add new question to the list
      setNewQuestion({
        ...newQuestion, // Retain the same IDs but reset the question field
        questions: "",
        id: Math.random().toString(36).slice(2), // Generate a new unique ID for the next question
      });
    }
  };

  // Handle removing a question from the list
  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  return (
    <div>
      {/* List of Questions */}
      <ul style={{ listStyle: "none", padding: "0" }}>
        {questions.map((question, index) => {
          console.log(question);
          return (
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
          );
        })}
      </ul>

      {/* Input for New Question */}
      <input
        type="text"
        placeholder="Add a new question"
        value={newQuestion.questions} // Bind the input to the `questions` field of newQuestion
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
        <div style={{ color: '#3BAE46', cursor: 'pointer' }}>
          <span style={{ marginRight: "10px" }}><Save /></span>
          Save Custom Questions
        </div>
      </div>
    </div>
  );
};

export default DueDiligenceQueries;