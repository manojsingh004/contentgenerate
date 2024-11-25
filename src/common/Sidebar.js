import React, { useContext, useState } from 'react';
import { Col, Button, Accordion, Form, ListGroupItem,ListGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { ChatContext } from './../DataContext/ChatContext';
import Cookies from 'js-cookie'; // Import the js-cookie library

const Sidebar = () => {
    const { practiceArea,
        setSelectedDocumentType,
        setSelectedPracticeArea,
        setFileName,setPracticeArea,
        setUploadedFile,
        chatId, setChatId,
        setIsUploaded,
        setQuestions,
        setNewQuestion,
    } = useContext(ChatContext);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await fetch("https://dev.ciceroai.net/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
                },
               
                body: JSON.stringify({ title: searchQuery })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await response.json();
            setPracticeArea(data);
            console.log(data);
        } catch (error) {
            console.error("Error searching:", error);
        }
    };

    const handleNewDdCaseClick = async() => {
        setSelectedPracticeArea(0);       // Reset Practice Area
        setSelectedDocumentType(0);       // Reset Document Type
        setFileName("");                  // Reset fileName
        setUploadedFile(null);            // Reset uploaded file
        setIsUploaded(false);             // Reset upload status
        setQuestions([]);                 // Clear questions array
        setNewQuestion("");
        try {
            const response = await fetch("https://dev.ciceroai.net/api/create-chat", {
                method: "GET",
            });
    
            if (!response.ok) {
                throw new Error("API request failed");
            }
    
            const data = await response.json();
            const newChatId = data.id;
    
            // Save the New DD Case ID in context
            setChatId(newChatId);  // Assuming you have a `setChatId` function in ChatContext
    
            // Navigate to "/practice-area" route after receiving the New DD Case ID  
            navigate("/practice-area");
    
        } catch (error) {
            console.error("Error creating New DD Case:", error);
        }
        
    };

    return (
        <Col md={2} className="sidebar h-100">
            <div className="d-flex align-items-center mb-4 justify-content-around px-2 gap-2">
                <Button variant="primary" className="w-100 NewDdCase" onClick={handleNewDdCaseClick}>
                    + New DD Case
                </Button>
                <Button className="search-btn d-flex align-items-center justify-content-center" onClick={toggleSearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </Button>
            </div>

            <div className="search-container">
                {isSearchOpen && (
                    <Form className="search-form"  onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                        <Form.Control type="text" placeholder="Search..."  value={searchQuery}
                            onChange={handleSearchChange}/>
                    </Form>
                )}
            </div>

            <div className="category-list-container mb-4">
                <Accordion defaultActiveKey={practiceArea.length ? practiceArea[0].id : null} className="category-list">
                    {practiceArea.map(item => (
                        <Accordion.Item eventKey={item.id} key={item.id}>
                            <Accordion.Header>
                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.82736 11.5028H5.48788C2.772 11.5028 1.41406 10.9046 1.41406 7.9136V4.92258C1.41406 2.52975 2.772 1.33334 5.48788 1.33334H10.9196C13.6355 1.33334 14.9934 2.52975 14.9934 4.92258V7.9136C14.9934 10.3064 13.6355 11.5028 10.9196 11.5028H10.5801C10.3697 11.5028 10.166 11.5926 10.037 11.7421L9.01851 12.9385C8.57039 13.4649 7.83711 13.4649 7.38899 12.9385L6.37053 11.7421C6.2619 11.6105 6.01068 11.5028 5.82736 11.5028Z" stroke="#001434" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M11.8818 6.53333H11.8878" stroke="#001434" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M8.4873 6.53333H8.49331" stroke="#001434" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4.80566 6.53333H4.81165" stroke="#001434" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <Link
                                        to={`/chat-practice-list/${item.id}/`}
                                        className='text-decoration-none'
                                    >
                                        {item.name}
                                    </Link>
                            </Accordion.Header>
                            <Accordion.Body>
                            <ListGroup as="ul" className="scrollable">
                                {typeof(item.responses)!==undefined  && item?.responses && Array.isArray(item.responses) && item.responses.map((response) =>{ 
                                    console.log(response.title)
                                    if(response.title!==null){
                                    const associativeArray = Object.keys(JSON.parse(response.title)).map(key => ( JSON.parse(response.title)[key] ));

                                    console.log(associativeArray[0],'testsdasd')
                                    return (<ListGroup.Item as="li" >
                                    <Link
                                        to={`/chat-route/${response.id}`}
                                        key={response.id}
                                        className='text-decoration-none'
                                    >
                                        {associativeArray[0]}
                                    </Link>
                                    </ListGroup.Item>  ) }else{
                                        return ('');
                                    }                               
                                })}
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>
        </Col>
    );
};

export default Sidebar;