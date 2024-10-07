import React, { useState } from 'react';
import { Row, Col, Card} from 'react-bootstrap';

const Dashboard = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    return (
        
                <Col md={9} className="right-content">
                    <h3>Dashboard</h3>
                    <Row className="RightPanelSide bg-white p-4 m-4 rounded-25 shadow-sm">
                        <Col md={6} lg={6} className="mb-4 mt-4">
                            <Card className="text-center shadow-sm conveyancing-card">
                                <Card.Body>
                                    <Card.Title>Conveyancing</Card.Title>
                                    <Card.Text>
                                        <h2>25</h2>
                                    </Card.Text>
                                    <Card.Link href="#">View more &rarr;</Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={6} className="mb-4 mt-4">
                            <Card className="text-center shadow-sm corporate-law-card">
                                <Card.Body>
                                    <Card.Title>Corporate Law</Card.Title>
                                    <Card.Text>
                                        <h2>5</h2>
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
                                        <h2>12</h2>
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
                                        <h2>20</h2>
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