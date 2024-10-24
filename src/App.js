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
import ChatList from './Pages/ChatList';


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
                                    <Route path="/practice-area" element={<NewChatPracticeArea />} />
                                    <Route path="/chat-route" element={<LegalChatbotGPT />} />
                                    <Route path="/chat-list" element={<ChatList />} />
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