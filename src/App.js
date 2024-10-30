import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './common/Header';
import Sidebar from './common/Sidebar';
import Footer from './common/Footer';
import bg from './bg.svg.png';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import NewChatPracticeArea from './NewChatPracticeArea';
import LegalChatbotGPT from './LegalChatbotGPT';
import { ChatProvider } from './DataContext/ChatContext';
import ChatPracticeAreaList from './Pages/ChatPracticeAreaList';
import ChatDocumentTypeList from './Pages/ChatDocumentTypeList';
import ChatResponse from './Pages/ChatResponse'; 

function App() {
    return (
        <ChatProvider>
            <Router>
                <div className="App" style={{ backgroundImage: `url(${bg})` }}>
                    <Header />
                    <Container fluid className="dashboard">
                        <Row className="dashboard-container">
                            <Sidebar />
                            <Col md={9}>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/chatcase" element={<Dashboard />} />
                                    <Route path="/practice-area" element={<NewChatPracticeArea />} />
                                    <Route path="/chat-route/:responseId" element={<LegalChatbotGPT />} />
                                    <Route path="/response/:responseId" element={<ChatResponse />} />
                                    <Route path="/chat-practice-list/:practiceAreaId" element={<ChatPracticeAreaList />} />
                                    <Route path="/chat-practice-list/:practiceAreaId/:documentTypeId" element={<ChatDocumentTypeList />} />
                                </Routes>
                            </Col>
                        </Row>
                    </Container>
                    <Footer />
                </div>
            </Router>
        </ChatProvider>
    );
}

export default App;