import React, { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Row, Col, Container, Button } from 'react-bootstrap';
import DueDiligenceQueries from "./../DueDiligenceQueries";
import { ChatContext } from './../DataContext/ChatContext';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Cookies from 'js-cookie'; // Import the js-cookie library
import { useParams } from 'react-router-dom';
import ScaleLoader from 'react-spinners/ScaleLoader';
// import { FaSave } from 'react-icons/fa'; 
// import { FaEdit } from 'react-icons/fa'; 
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';


const ChatResponse = () => {
    const {
        selectedPracticeArea, setSelectedPracticeArea,
        selectedDocumentType, setSelectedDocumentType,
        practiceArea, documentTypes, fetchDocumentTypes,
        selectedPracticeAreaName, setSelectedPracticeAreaName,
        selectedDocumentTypeName, setSelectedDocumentTypeName,
        setPracticeArea,
        titleDoc, setTitleDoc,
        setFilePath,
        setQuestions, setFileQuestions,
        chatId, setChatId,
        fileName, isUploaded, setIsUploaded, handleFileChange,
        questions, fetchQuestion, handleAddQuestion, uploadedFile, setResponseQuestion, fileQuestions,
        newQuestion, setNewQuestion, setFileName, activeFileName, setActiveFileName
    } = useContext(ChatContext);
    const { responseId } = useParams();
    
    const [show, setShow] = useState(false);
    const [deleteSelect, setDeleteSelect] = useState('');
    const [showDocType, setShowDocType] = useState(false);
    const [editSelected, setEditSelected] = useState('');
    const [documentId,setDocumentId] = useState(selectedDocumentType);
    const handleClose = () => setShow(false);
    const handleShow = (key, item) => {
        setDeleteSelect(item)
        setShow(true);
       

    };
    const handleDeleteFIleList = async () => {
        // setActiveFileName(file);    
        const formData = new FormData();
        formData.append('fileName', deleteSelect);

        try {
            // Send data to server
            const response = await fetch(`https://dev.ciceroai.net/api/deleteFileDataApi/${responseId}`, {
                method: 'POST',
                body: formData,
                credentials: 'include', // Include credentials (cookies)
                headers: {
                    'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'), // Set the XSRF token from the cookie
                },
            });

            if (response.ok) {

                const updatedData = await response.json();
                const dataFileName = JSON.parse(updatedData.original_file_name);
                setFileName(dataFileName);
                document.querySelector("#fileInputMulti").value = '';
                setActiveFileName(dataFileName[0]);
                setShow(false)
            } else {

            }
        } catch (error) {

        }
    }
    const navigate = useNavigate(); // Initialize useNavigate
    // Loading state
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // State to track editing mode
    const [editedTitle, setEditedTitle] = useState((typeof (titleDoc) == 'string' ? titleDoc : '')); // Local state for edited title

    useEffect(() => {
        // Function to call the /createSession route

        const createSession = async () => {
            setLoading(true);

            try {
                const response = await fetch(`https://dev.ciceroai.net/api/response/${responseId}`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies if needed
                    headers: {
                        'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'), // Set the XSRF token from the cookie
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFileQuestions(JSON.parse(data.questions));
                    // Await the fetchDocumentTypes directly
                    await fetchDocumentTypes(data.area_of_practice_id);
                    console.log(documentTypes);
                    // Now documentTypes should be updated after fetchDocumentTypes completes
                    const name = documentTypes.find(area => parseInt(area.id) === parseInt(data.document_type_id));

                    console.log(name, documentTypes); // Should reflect the latest state now

                    // Set the other state values
                    setSelectedPracticeArea(data.area_of_practice_id);
                    setSelectedDocumentType(parseInt(data.document_type_id));
                    const original = JSON.parse(data.original_file_name);

                    if (original.length > 0) {
                        const firstFileName = original[0]; // Get the first filename

                        if (activeFileName === '') {
                            setActiveFileName(firstFileName);
                        }
                        console.log(JSON.parse(data.title)[firstFileName], 'pppp')
                        if (JSON.parse(data.title)[firstFileName] != null) {
                            setTitleDoc(JSON.parse(data.title)[firstFileName]);
                            setEditedTitle((typeof (JSON.parse(data.title)[firstFileName]) == 'string' ? JSON.parse(data.title)[firstFileName] : data.title));
                        }


                        // Access questions dynamically using firstFileName as the key
                        const questionsForFile = data.file_contents.references.questions[firstFileName];

                        console.log(questionsForFile, 'Questions for', firstFileName);
                    }
                    const dataFileName = JSON.parse(data.original_file_name);
                    setFileName(current => dataFileName);


                    console.log(questions, fileQuestions, 'sadjfioajsdolifjal;siodjifpaiosdjf', JSON.parse(data.questions))
                    setQuestions(JSON.parse(data.questions));
                    setSelectedPracticeAreaName(name ? name.name : ''); // Guard against null
                    setIsUploaded(true);
                    setChatId(data.id);
                    // setTitleDoc(data.title);



                    setFileName(JSON.parse(data.original_file_name));
                    setFilePath(current => data.filepath);
                } else {
                    console.error('Failed to create session:', response.statusText);
                }
            } catch (error) {
                console.error('Error creating session:', error);
            } finally {
                setLoading(false);
            }
        };

        // Call the createSession function when the component mounts
        createSession();
    }, [responseId]); // Empty dependency array ensures it runs once on component mount

    const handleEditTitle = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (e) => {
        setEditedTitle(e.target.value);
    };
    const handleSaveTitleOpen = () => {
        setTitleDoc(editedTitle); // Update the context with the new title
        setIsEditing(false); // Exit editing mode

    }
    const handleSaveTitle = async () => {
        setTitleDoc(editedTitle); // Update the context with the new title
        setIsEditing(false); // Exit editing mode
        try {
            // Send data to server
            const response = await fetch(`https://dev.ciceroai.net/api/editChatTitleApi/${chatId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
                },

                body: JSON.stringify({ title: editedTitle })
            });

            if (response.ok) {
                const updatedData = await response.json(); // Assume the response is JSON data
                console.log(updatedData.file_contents.data.id, updatedData.file_contents.references);
                setTitleDoc(current => updatedData.title)
                //  setResponseQuestion(updatedData.file_contents.references);// Update context with new questions from server
                // navigate(`/chat-route/${updatedData.file_contents.data.id}`); // Navigate to chat route
            } else {
                //  navigate('/chat-route'); // Navigate to chat route
                console.error('Error with server response', response.statusText);
            }
        } catch (error) {
            // navigate('/chat-route'); // Navigate to chat route
        } finally {
            setLoading(false); // Hide loader after completion
        }
    };
    const handleDocumentType = async(e)=>{
       
        try {
            const response = await axios.get(`https://dev.ciceroai.net/api/get-question/${documentId}/${selectedPracticeArea}`);
            // setQuestions(response.data);
            editSelected.forEach(element => {
                setFileQuestions((prevFileQuestions) => ({
                    ...prevFileQuestions,
                    [element]: response.data,
                  })); 
            });
            
            console.log(response, 'data response')
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
        setShowDocType(false);
       
    }
    const handlePracticeAreaChange = (e) => {
        const selectedAreaId = e.target.value;
        setSelectedPracticeArea(selectedAreaId);
        fetchDocumentTypes(selectedAreaId);
        setSelectedDocumentType(0);
    };
    const handleShowDocumentType = (key, item) => {
        setShowDocType(true);
        setEditSelected([item]);
    }

    const handleStartAIAnalysis = async () => {
        setLoading(true); // Show loader

        const formData = new FormData();
        formData.append('id', chatId);
        formData.append('questions', JSON.stringify(fileQuestions)); // Append questions array
        const xsrfToken = Cookies.get('XSRF-TOKEN');
        try {
            // Send data to server
            const response = await fetch('https://dev.ciceroai.net/api/questions', {
                method: 'POST',
                body: formData,
                credentials: 'include', // Include credentials (cookies)
                headers: {
                    'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'), // Set the XSRF token from the cookie
                },
            });

            if (response.ok) {
                const updatedData = await response.json(); // Assume the response is JSON data
                console.log(updatedData.file_contents.data.id, updatedData.file_contents.references)
                setResponseQuestion(updatedData.file_contents.references);// Update context with new questions from server
                navigate(`/chat-route/${updatedData.file_contents.data.id}`); // Navigate to chat route
            } else {
                navigate('/chat-route'); // Navigate to chat route
                console.error('Error with server response', response.statusText);
            }
        } catch (error) {
            navigate('/chat-route'); // Navigate to chat route
        } finally {
            setLoading(false); // Hide loader after completion
        }
    };
    const handleDocumentTypeChange = (e) => {
        const selectedDocumentId = e.target.value;
        setSelectedDocumentType(selectedDocumentId);
        fetchQuestion(selectedDocumentId);
    };

    const handleFileInput = async (e) => {
        const files = e.target.files; // Array of selected files
        const formData = new FormData();
        const arrayData = [];
        for (const file of files) {
            formData.append('file[]', file); // Append each file to the array in FormData
            arrayData.push(file.name)
        }
        formData.append('id', chatId);
        formData.append('area_of_practice_id', selectedPracticeArea);
        formData.append('document_type_id', selectedDocumentType);
        setEditSelected(arrayData);
        const xsrfToken = Cookies.get('XSRF-TOKEN');
        try {
            // Send data to server
            const response = await fetch('https://dev.ciceroai.net/api/upload-file', {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'X-XSRF-TOKEN': xsrfToken, // Set the XSRF token from the cookie
                },
            });

            // Update the context with files

            if (response.ok) {
                const updatedData = await response.json(); // Assume the response is JSON data
                await handleFileChange(updatedData.success);
                console.log('Files uploaded successfully:', updatedData);
                setShowDocType(true);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };
    const handleActiveQuestionList = (key, file) => {
        setActiveFileName(file);
    }

    return (
        <Col md={12} className="right-content">
            <Container fluid>
                {show && (
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop=""
                        keyboard={false}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Delete File</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Delete file
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleDeleteFIleList}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
                {showDocType && (
                    <Modal
                        show={showDocType}
                        onHide={()=>setShowDocType(false)}
                        backdrop=""
                        keyboard={false}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Document Type</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        {selectedPracticeArea !== 0 && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Document Type</Form.Label>
                                    <Form.Select value={selectedDocumentType}  onChange={(e)=>{
                                       
                                            const selectedDocumentId = e.target.value;
                                            setDocumentId(selectedDocumentId);
                                        
                                    }}>
                                        <option value="">Select Document Type</option>
                                        {documentTypes.map((type) => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                        )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={()=>setShowDocType(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleDocumentType}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
                <Row>
                    {isEditing ? (
                        <Form.Group className="d-flex mb-3">
                            <Form.Control
                                type="text"
                                value={editedTitle}
                                onChange={handleTitleChange}
                                // onBlur={handleSaveTitle} // Save on blur if you want
                                className='text-edit-box'
                            />
                            <Button variant="link" onClick={handleSaveTitle} title="Save">
                                {/* <FaSave /> */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy2-fill" viewBox="0 0 16 16">
                                    <path d="M12 2h-2v3h2z" />
                                    <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1" />
                                </svg>
                            </Button>
                        </Form.Group>
                    ) : (
                        <h3 onClick={handleEditTitle}>{(typeof (titleDoc) == 'string' ? titleDoc : '')}
                            <Button variant="link" onClick={handleSaveTitleOpen} title="Edit">
                                {/* <FaEdit /> */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                            </Button>
                        </h3>
                    )}
                    <Row className="RightPanelSide bg-white m-2 rounded-25 shadow-sm">
                        <Col md={12} lg={12} className="mb-4 mt-4">
                            <Form.Group className="mb-3">
                                <Form.Label>Select Practice Area</Form.Label>
                                <Form.Select value={selectedPracticeArea} disabled onChange={handlePracticeAreaChange}>
                                    <option value="">Select Practice Area</option>
                                    {practiceArea.map((area) => (
                                        <option key={area.id} value={area.id}>{area.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {selectedPracticeArea !== 0 && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Document Type</Form.Label>
                                    <Form.Select value={selectedDocumentType} disabled onChange={handleDocumentTypeChange}>
                                        <option value="">Select Document Type</option>
                                        {documentTypes.map((type) => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            )}

                            {selectedDocumentType !== 0 && (
                                !isUploaded ? (
                                    <Container style={{ border: "1.5px dashed #CFD4D9", borderRadius: "12px" }} className=" position-relative">
                                        <Row className="justify-content-center">
                                            <Col md={6}>
                                                <div className="my-5">
                                                    {/* <h2 className="text-center">Upload Documents</h2> */}
                                                    <div className="d-flex justify-content-center">
                                                        <div className="upload-area" style={{ textAlign: "center" }}>
                                                            <label htmlFor="fileInput">
                                                                <i className="fas fa-cloud-upload"></i>
                                                                <span>Drag and drop your file here</span>
                                                            </label>
                                                            <br />
                                                            <input
                                                                type="file"
                                                                id="fileInput"
                                                                accept=".doc,.docx,.xls,.xlsx,.pdf"
                                                                onChange={handleFileInput}
                                                                className="position-absolute"
                                                                style={{ opacity: '0' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-center mt-3">
                                                        <Button variant="primary">Choose File</Button>
                                                    </div>
                                                    <div className="text-center mt-2">
                                                        <small>Click to select your image from library</small>
                                                    </div>
                                                    <div className="text-center mt-2">
                                                        <small>Any (*.doc, .docx, .xls, xlsx or .pdf) up to 10 MB</small>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                ) : (
                                    (
                                        <>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Uploaded Files</Form.Label>
                                            </Form.Group>
                                            <div className="d-flex">
                                                <Button className="" style={{ marginRight: "10px" }} onChange={handleFileInput} multiple>
                                                    <input
                                                        type="file"
                                                        id="fileInputMulti"
                                                        accept=".doc,.docx,.xls,.xlsx,.pdf"
                                                        onChange={handleFileInput}
                                                        className="position-absolute"
                                                        multiple // Enable multiple file selection
                                                        style={{ opacity: '0' }}
                                                    />
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13.5 3H12H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H7.5M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V9.75V12V19C19 20.1046 18.1046 21 17 21H16.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M12 21V13M12 13L14.5 15.5M12 13L9.5 15.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <span>
                                                        Upload Document
                                                    </span>
                                                </Button>


                                                {fileName.map((item, key) => {
                                                    return (
                                                        <span className={`position-relative d-flex me-3 ${(activeFileName == item ? 'active' : '')}`} data-file={item} onClick={() => handleActiveQuestionList(key, item)} key={key}>
                                                            <Button className="upolad-file-name text-white d-flex align-items-center gap-2" style={{ marginLeft: '12px' }}>
                                                                <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M4.55556 11.6667L6.33333 13.4444L9.88889 9.88889M8.11111 1H3.84444C2.8488 1 2.35097 1 1.97068 1.19377C1.63617 1.3642 1.3642 1.63617 1.19377 1.97068C1 2.35097 1 2.8488 1 3.84444V14.1556C1 15.1512 1 15.6491 1.19377 16.0293C1.3642 16.3638 1.63617 16.6358 1.97068 16.8062C2.35097 17 2.8488 17 3.84444 17H10.6C11.5956 17 12.0935 17 12.4738 16.8062C12.8083 16.6358 13.0803 16.3638 13.2507 16.0293C13.4444 15.6491 13.4444 15.1512 13.4444 14.1556V6.33333M8.11111 1L13.4444 6.33333M8.11111 1V4.91111C8.11111 5.40893 8.11111 5.65785 8.208 5.84799C8.29324 6.01524 8.42916 6.15123 8.59644 6.23645C8.78658 6.33333 9.03547 6.33333 9.53333 6.33333H13.4444" stroke="#052044" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg><span className='midnight-blue'>
                                                                    {item}
                                                                </span>
                                                            </Button>
                                                            <span className='position-absolute edit-delete-option'>
                                                                <span className='cursor-pointer' onClick={() => handleShowDocumentType(key, item)} key={key}>
                                                                    <svg title="Edit" xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"></path></svg>
                                                                </span>
                                                                <span className='cursor-pointer' onClick={() => handleShow(key, item)} key={key}>
                                                                    <svg title="Delete" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                                    </svg>
                                                                </span>
                                                            </span>
                                                        </span>)
                                                })}
                                            </div>
                                            <Form.Group className="mt-3">
                                                <Form.Label>DD Queries</Form.Label>
                                            </Form.Group>


                                            <DueDiligenceQueries questions={fileQuestions} handleAddQuestion={handleAddQuestion} />
                                        </>

                                    )
                                )

                            )}
                            <span className='d-flex align-items-center justify-content-center'>
                                {loading ? (
                                    <ScaleLoader color="#333333" /> // Show loader only if loading is true
                                ) : (
                                    <Button onClick={handleStartAIAnalysis} style={{ marginTop: "20px", backgroundColor: 'rgba(75, 87, 211, 1)', width: '100%' }}>
                                        <span>Start AI Analysis</span>
                                    </Button>
                                )}
                            </span>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </Col>
    );
};

export default ChatResponse;