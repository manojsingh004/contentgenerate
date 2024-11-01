import React, { useState,useEffect } from 'react';
import { Row, Col, Card} from 'react-bootstrap';
import Cookies from 'js-cookie'; // Import the js-cookie library

const Dashboard = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [conveyancing, setConveyancing] = useState(false);
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };
    useEffect(() => {
        // Function to call the /createSession route
        const createSession = async () => {
            try {
                const response = await fetch('https://dev.ciceroai.net/api/conveyancing', {
                    method: 'GET',
                    credentials: 'include', // Include cookies if needed
                    headers: {
                        'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'), // Set the XSRF token from the cookie
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setConveyancing(data);
                    // Do something with the session data if necessary
                } else {
                    console.error('Failed to create session:', response.statusText);
                }
            } catch (error) {
                console.error('Error creating session:', error);
            }
        };

        // Call the createSession function when the component mounts
        createSession();
    }, []); // Empty dependency array ensures it runs once on component mount


    return (
        
                <Col md={9} className="right-content">
                    <h3>Dashboard</h3>
                    <Row className="RightPanelSide bg-white p-4 m-4 rounded-25 shadow-sm">
                        <Col md={6} lg={6} className="mb-4 mt-4">
                            <Card className="text-center shadow-sm conveyancing-card">
                                <Card.Body>
                                    <Card.Title>Conveyancing</Card.Title>
                                    <Card.Text>
                                        <h2>{conveyancing}</h2>
                                    </Card.Text>
                                    
                                    <Card.Link href="/chat-practice-list/5/">View more &rarr;</Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={6} className="mb-4 mt-4">
                            <Card className="text-center shadow-sm corporate-law-card">
                                <Card.Body>
                                    <Card.Title>Corporate Law</Card.Title>
                                    <Card.Text>
                                        <h2>0</h2>
                                    </Card.Text>
                                    <Card.Link href="#">View more &rarr;</Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={6} className="mb-4 mt-4">
                            <Card className="text-center shadow-sm employment-law-card">
                                <Card.Body>
                                    <Card.Title>Employment Law</Card.Title>
                                    <Card.Text>
                                        <h2>0</h2>
                                    </Card.Text>
                                    <Card.Link href="#">View more &rarr;</Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={6} className="mb-4 mt-4">
                            <Card className="text-center shadow-sm ip-law-card">
                                <Card.Body>
                                    <Card.Title>Intellectual Property</Card.Title>
                                    <Card.Text>
                                        <h2>0</h2>
                                    </Card.Text>
                                    <Card.Link href="#">View more &rarr;</Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            
    );
};

export default Dashboard;