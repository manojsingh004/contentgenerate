import React, { useContext } from "react";
import { Row, Col, Button, Table, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ChatContext } from "./DataContext/ChatContext";

const LegalChatbotGPT = () => {
    // Access context values and functions
    const {
        fileName,
        isUploaded,
        handleFileChange,
        questions,
        handleAddQuestion,
        responseQuestion,
        newQuestion,
        setNewQuestion,
        handleCommentChange
    } = useContext(ChatContext);
    console.log(responseQuestion);
    return (
        <>
            <Container fluid>
                <Row>
                    <Col md={8} className="right-content">
                        <h3>New Chat</h3>
                        <Row className="RightPanelSide bg-white p-4 m-4 rounded-25 shadow-sm">


                            {/* Main Content */}

                            <h3>Create Chatbot GPT</h3>
                            <div className="upload-section mb-4">
                                <Button variant="primary">
                                    <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                                        <i className="fas fa-cloud-upload"></i> Upload Document
                                    </label>
                                </Button>
                                {fileName && <span className="ml-2">{fileName.name}</span>}
                                <input
                                    type="file"
                                    id="fileInput"
                                    style={{ display: 'none' }}
                                // onChange={handleFileUpload}
                                />
                            </div>

                            {/* Questions Table */}
                            <h5>Contract of Sale</h5>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th>Response</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {responseQuestion.questions.map((q, key) => {
                                        console.log(key)
                                        return (
                                            <tr >
                                                <td>{q}</td>
                                                <td>{responseQuestion.answers[key]}</td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        value={''}
                                                        onChange={(e) => handleCommentChange(key, e.target.value)}
                                                        placeholder={"Add comment"}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )}
                                </tbody>
                            </Table>

                            {/* AI Analysis Section */}
                            <div className="ai-analysis mt-4">
                                <h5>AI Analysis: Accuracy of Party Identification</h5>
                                <p>
                                    {responseQuestion.summary}
                                </p>
                            </div>


                        </Row>
                    </Col>
                    <Col md={4} className="right-content">
                        <Row className="RightPanelSide bg-white p-4 m-4 rounded-25 shadow-sm">
                            <h3>Create Chatbot GPT</h3>




                            {/* AI Analysis Section */}
                            <div className="ai-analysis mt-4">

                                {responseQuestion.references.map((q, key) => {
                                    console.log(key)
                                    return (
                                        <>
                                            <h5>{q.reference_title}</h5>
                                            <p>
                                                {q.reference_content}
                                            </p>
                                        </>

                                    )
                                })}

                            </div>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>

    );
};

export default LegalChatbotGPT;