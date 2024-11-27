/* eslint-disable react/jsx-no-undef */
import React, { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Row, Col, Container, Button } from 'react-bootstrap';
import DueDiligenceQueries from "./DueDiligenceQueries";
import { ChatContext } from './DataContext/ChatContext';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Cookies from 'js-cookie'; // Import the js-cookie library
import ScaleLoader from 'react-spinners/ScaleLoader';
import Modal from 'react-bootstrap/Modal';


const NewChatPracticeArea = () => {
    const {
        selectedPracticeArea, setSelectedPracticeArea, setTitleDoc,
        selectedDocumentType, setSelectedDocumentType,
        practiceArea, documentTypes, fetchDocumentTypes,
        selectedPracticeAreaName, setSelectedPracticeAreaName,
        selectedDocumentTypeName, setSelectedDocumentTypeName,
        chatId, setChatId,activeFileName, setActiveFileName,setFileName,
        fileName, isUploaded, handleFileChange,fileQuestions, setFileQuestions,
        questions, fetchQuestion, handleAddQuestion, uploadedFile, setResponseQuestion,
        newQuestion, setNewQuestion,
    } = useContext(ChatContext);

    const [loading, setLoading] = useState(false); // Add loading state
    const [show, setShow] = useState(false);
    const [deleteSelect, setDeleteSelect] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = (key, item) => {
        setDeleteSelect(item)
        setShow(true)
    };
    const handleDeleteFIleList = async ( ) => {
        // setActiveFileName(file);    
        const formData = new FormData();
        formData.append('fileName', deleteSelect);

        try {
            // Send data to server
            const response = await fetch(`https://dev.ciceroai.net/api/deleteFileDataApi/${chatId}`, {
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
                setActiveFileName(dataFileName[0]);
                setShow(false)
            } else {

            }
        } catch (error) {

        }
    }
    const navigate = useNavigate(); // Initialize useNavigate
    useEffect(() => {
        setTitleDoc('');
        // Function to call the /createSession route
        const createSession = async () => {
            try {
                const response = await fetch('https://dev.ciceroai.net/api/createSession', {
                    method: 'GET',
                    credentials: 'include', // Include cookies if needed
                    headers: {
                        'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'), // Set the XSRF token from the cookie
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Session created:', data);
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
    useEffect(()=>{
        console.log('sdnfoasdf',fileQuestions)
    },[fileQuestions,fileName])
    const handlePracticeAreaChange = (e) => {
        const selectedAreaId = parseInt(e.target.value);
        setSelectedPracticeArea(selectedAreaId);
        const name = practiceArea.find(area => area.id === selectedAreaId);
        setSelectedPracticeAreaName(name.name);
        console.log(name, practiceArea, selectedAreaId)
        fetchDocumentTypes(selectedAreaId);
        setSelectedDocumentType(0);
    };

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
                console.log(updatedData.file_contents.references)
                setResponseQuestion(current => updatedData.file_contents.references);// Update context with new questions from server
                console.log(updatedData.file_contents,'sdfsdfsd');
                navigate(`/chat-route/${updatedData.id}`); // Navigate to chat route
            } else {
                navigate('/chat-route'); // Navigate to chat route
                console.error('Error with server response', response.statusText);
            }
        } catch (error) {
            navigate('/chat-route'); // Navigate to chat route
        }
    };
    const handleDocumentTypeChange = (e) => {
        const selectedDocumentId = parseInt(e.target.value);
        setSelectedDocumentType(selectedDocumentId);
        const name = documentTypes.find(docType => docType.id === selectedDocumentId);
        setSelectedDocumentTypeName(name.name);
        fetchQuestion(selectedDocumentId);
    };

    const handleFileInput = async (e) => {
        const files = e.target.files; // Array of selected files
        const formData = new FormData();

        for (const file of files) {
            formData.append('file[]', file); // Append each file to the array in FormData
        }
        formData.append('id', chatId);
        formData.append('area_of_practice_id', selectedPracticeArea);
        formData.append('document_type_id', selectedDocumentType);

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
                handleFileChange(updatedData.success);
                console.log('Files uploaded successfully:', updatedData);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const handleFileInputOneByOne = async (e) => {
        const file = e.target.files[0]; // Get the selected single file
        const formData = new FormData();

        formData.append('file', file);
        formData.append('id', chatId);
        formData.append('area_of_practice_id', selectedPracticeArea);
        formData.append('document_type_id', selectedDocumentType);

        const xsrfToken = Cookies.get('XSRF-TOKEN');
        try {
            const response = await fetch('https://dev.ciceroai.net/api/upload-file', {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'X-XSRF-TOKEN': xsrfToken,
                },
            });

            if (response.ok) {
                const updatedData = await response.json();
                console.log('File uploaded successfully:', updatedData);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    const handleActiveQuestionList = (key,file)=>{
        setActiveFileName(file);        
    }
    return (
        <Col md={12} className="right-content">
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
            <Container fluid>
                <Row>
                    <h3 className='fs24 ps-4'>New DD Case</h3>
                    <Row className="RightPanelSide bg-white m-2 rounded-25 shadow-sm">
                        <Col md={12} lg={12} className="mb-4 mt-4">
                            <Form.Group className="mb-3">
                                <Form.Label>Select Practice Area</Form.Label>
                                <Form.Select value={selectedPracticeArea} onChange={handlePracticeAreaChange}>
                                    <option value="">Select Practice Area</option>
                                    {practiceArea.map((area) => (
                                        <option key={area.id} value={area.id}>{area.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {selectedPracticeArea !== 0 && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Document Type</Form.Label>
                                    <Form.Select value={selectedDocumentType} onChange={handleDocumentTypeChange}>
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
                                                        <div className="upload-area d-flex flex-column text-center gap-2">
                                                            <label htmlFor="fileInput">
                                                                <i className="fas fa-cloud-upload"></i>
                                                                <span>Drag and drop your file here</span>
                                                            </label>
                                                            <span className='upload-hidden-btn position-relative cursor-pointer'>
                                                                <input
                                                                    type="file"
                                                                    id="fileInput"
                                                                    accept=".doc,.docx,.xls,.xlsx,.pdf"
                                                                    onChange={handleFileInput}
                                                                    className="position-absolute"
                                                                    multiple // Enable multiple file selection
                                                                    style={{ opacity: '0' }}
                                                                />
                                                                <Button variant="primary">Choose File</Button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* <div className="text-center mt-3">
                                                    <Button variant="primary">Choose File</Button>
                                                </div> */}
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
                                                <Button className="" style={{ marginRight: "10px" }}  multiple>
                                                    <input
                                                        type="file"
                                                        id="fileInput"
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


                                                {fileName.length>0 && fileName.map((item, key) => {
                                                    return (
                                                        <span className={`position-relative d-flex ${(activeFileName==item?'active':'')}`} data-file={item} onClick={()=>handleActiveQuestionList(key,item)} key={key}>
                                                            <Button className="upolad-file-name text-white d-flex align-items-center gap-2 " style={{ marginLeft: '6px' }}>
                                                                <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M4.55556 11.6667L6.33333 13.4444L9.88889 9.88889M8.11111 1H3.84444C2.8488 1 2.35097 1 1.97068 1.19377C1.63617 1.3642 1.3642 1.63617 1.19377 1.97068C1 2.35097 1 2.8488 1 3.84444V14.1556C1 15.1512 1 15.6491 1.19377 16.0293C1.3642 16.3638 1.63617 16.6358 1.97068 16.8062C2.35097 17 2.8488 17 3.84444 17H10.6C11.5956 17 12.0935 17 12.4738 16.8062C12.8083 16.6358 13.0803 16.3638 13.2507 16.0293C13.4444 15.6491 13.4444 15.1512 13.4444 14.1556V6.33333M8.11111 1L13.4444 6.33333M8.11111 1V4.91111C8.11111 5.40893 8.11111 5.65785 8.208 5.84799C8.29324 6.01524 8.42916 6.15123 8.59644 6.23645C8.78658 6.33333 9.03547 6.33333 9.53333 6.33333H13.4444" stroke="#052044" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg><span className='midnight-blue'>
                                                                    {item}
                                                                </span>
                                                            </Button>
                                                            <span className='position-absolute close-doc' onClick={() => handleShow(key, item)} key={key}>
                                                                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path opacity="0.4" d="M9.75 16.5C13.8921 16.5 17.25 13.1421 17.25 9C17.25 4.85786 13.8921 1.5 9.75 1.5C5.60786 1.5 2.25 4.85786 2.25 9C2.25 13.1421 5.60786 16.5 9.75 16.5Z" fill="#B0B0B0" />
                                                                    <path d="M10.5445 9.00007L12.2695 7.27508C12.487 7.05758 12.487 6.69758 12.2695 6.48008C12.052 6.26258 11.692 6.26258 11.4745 6.48008L9.74955 8.20507L8.02452 6.48008C7.80702 6.26258 7.44702 6.26258 7.22953 6.48008C7.01203 6.69758 7.01203 7.05758 7.22953 7.27508L8.95455 9.00007L7.22953 10.7251C7.01203 10.9426 7.01203 11.3026 7.22953 11.5201C7.34203 11.6326 7.48452 11.6851 7.62702 11.6851C7.76952 11.6851 7.91202 11.6326 8.02452 11.5201L9.74955 9.79507L11.4745 11.5201C11.587 11.6326 11.7295 11.6851 11.872 11.6851C12.0145 11.6851 12.157 11.6326 12.2695 11.5201C12.487 11.3026 12.487 10.9426 12.2695 10.7251L10.5445 9.00007Z" fill="#292D32" />
                                                                </svg>
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

export default NewChatPracticeArea;