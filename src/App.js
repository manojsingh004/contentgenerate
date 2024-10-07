import React from 'react';
import { Container, Row ,Col} from 'react-bootstrap';
import './Dashboard.css'; // Custom CSS for additional styling
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './common/Header';
import Sidebar from './common/Sidebar';
import Footer from './common/Footer';
import bg from './bg.svg.png'; // Adjust the path to your image

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import NewChatPracticeArea from './NewChatPracticeArea';

function App() {
    return (
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
                            </Routes>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>
        </Router>
    );
}

export default App;