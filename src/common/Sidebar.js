import React, { useState,useEffect } from 'react';
import { Col, Button, Accordion, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Assuming you're using axios for API calls

const Sidebar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate(); // Initialize the navigate function
    const [practiceArea, setPracticeArea] = useState([]);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    // Handle button click to navigate to NewChatPracticeArea
    const handleNewDdCaseClick = () => {
        navigate('/practice-area'); // Navigate to /practice-area route
    };
    useEffect(() => {
        const fetchPracticeAreas = async () => {
            try {
                const response = await axios.get('https://dev.ciceroai.net/api/area-of-practice');
                setPracticeArea(response.data); // Assuming the API returns an array of practice areas
            } catch (error) {
                console.error("Error fetching practice areas:", error);
            }
        };

        fetchPracticeAreas();
    }, []);
    return (
        <Col md={3} className="sidebar h-100">
            <div className="d-flex align-items-center mb-4 justify-content-around">
                <Button variant="primary" className="w-75 NewDdCase" onClick={handleNewDdCaseClick}>
                    + New DD Case
                </Button>
                <Button className="search-btn w-20" onClick={toggleSearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </Button>
            </div>

            <div className="search-container">
                {isSearchOpen && (
                    <Form className="search-form">
                        <Form.Control type="text" placeholder="Search..." />
                    </Form>
                )}
            </div>
                
            <div className="category-list-container mb-4">
                <Accordion defaultActiveKey={practiceArea.shift()?.id} className="category-list">
                    {practiceArea.map(item=>{
                        return(<Accordion.Item eventKey={item.id}>
                            <Accordion.Header> <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.82736 11.5028H5.48788C2.772 11.5028 1.41406 10.9046 1.41406 7.9136V4.92258C1.41406 2.52975 2.772 1.33334 5.48788 1.33334H10.9196C13.6355 1.33334 14.9934 2.52975 14.9934 4.92258V7.9136C14.9934 10.3064 13.6355 11.5028 10.9196 11.5028H10.5801C10.3697 11.5028 10.166 11.5926 10.037 11.7421L9.01851 12.9385C8.57039 13.4649 7.83711 13.4649 7.38899 12.9385L6.37053 11.7421C6.2619 11.6105 6.01068 11.5028 5.82736 11.5028Z" stroke="#001434" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M11.8818 6.53333H11.8878" stroke="#001434" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M8.4873 6.53333H8.49331" stroke="#001434" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M4.80566 6.53333H4.81165" stroke="#001434" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                                {item.name}</Accordion.Header>
                            <Accordion.Body>
                                <p>Sub item 1</p>
                                <p>Sub item 2</p>
                            </Accordion.Body>
                        </Accordion.Item>)
                    })}
                    
                    
                </Accordion>
            </div>
        </Col>
    );
};

export default Sidebar;