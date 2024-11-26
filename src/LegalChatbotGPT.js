import React, { useContext, useRef, useEffect, useState } from "react";
import { Row, Col, Button, Table, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ChatContext } from "./DataContext/ChatContext";
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { useReactToPrint } from "react-to-print";

import { Document, Packer, Paragraph, TextRun } from 'docx';

import DocumentHighlighter from "./common/DocumentHighlighter";
// import { Button as BootstrapButton } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

const LegalChatbotGPT = () => {
    // Access context values and functions
    const {
        fileName,
        isUploaded,
        fetchDocumentTypes, documentTypes, setSelectedPracticeArea,
        setLoading, setIsUploaded, setSelectedDocumentType, setQuestions,
        filePath, setChatId, setEditedTitle, setFileName, setFilePath,
        handleFileChange,
        questions,
        handleAddQuestion, activeFileName, setActiveFileName,
        responseQuestion, setResponseQuestion,
        selectedPracticeAreaName, setSelectedPracticeAreaName, selectedDocumentType,
        selectedDocumentTypeName, setSelectedDocumentTypeName,
        newQuestion,
        titleDoc,
        setTitleDoc,
        setNewQuestion
    } = useContext(ChatContext);

    const [comments, setComments] = useState({});

    const { responseId } = useParams();
    const contentRef = useRef(null); // Define the ref for printable content
    const contentCompleteRef = useRef(null);
    const docRefs = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: contentRef, // Set content to print from contentRef
        documentTitle: "PrintableDocument",
        onAfterPrint: () => alert("Print success!"),
    });
    const handlePrintComplete = useReactToPrint({
        contentRef: contentCompleteRef, // Set content to print from contentRef
        documentTitle: "PrintableDocument",
        onAfterPrint: () => alert("Print success!"),
    });


    // Rajiv Code Start
    useEffect(() => {
        // Function to call the /createSession route

        const createSession = async () => {
            try {
                const response = await fetch(`https://dev.ciceroai.net/api/response/${responseId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTitleDoc(JSON.parse(data.title));
                    setComments(JSON.parse(data.comments));
                    console.log(JSON.parse(data.comments));
                    setResponseQuestion(current => data.file_contents.references);
                    const original = JSON.parse(data.original_file_name);

                    if (original.length > 0) {
                        const firstFileName = original[0]; // Get the first filename

                        if (activeFileName === '') {
                            setActiveFileName(firstFileName);
                        }

                        // Access questions dynamically using firstFileName as the key
                        const questionsForFile = data.file_contents.references.questions[firstFileName];

                        console.log(questionsForFile, 'Questions for', firstFileName);
                    }


                    await fetchDocumentTypes(data.area_of_practice_id);

                    setSelectedPracticeArea(data.area_of_practice_id);
                    setSelectedDocumentType(parseInt(data.document_type_id));
                    setQuestions(JSON.parse(data.questions));
                    setIsUploaded(true);
                    setChatId(data.id);
                    setFileName(JSON.parse(data.original_file_name));
                    setFilePath(data.filepath);
                } else {
                    console.error('Failed to create session:', response.statusText);
                }
            } catch (error) {
                console.error('Error creating session:', error);
            }
        };

        createSession();
    }, [responseId, activeFileName]);

    // Watch for changes to documentTypes and selectedDocumentType
    useEffect(() => {
        if (documentTypes.length > 0 && selectedDocumentType) {
            const name = documentTypes.find(
                area => parseInt(area.id) === parseInt(selectedDocumentType)
            );
            setSelectedPracticeAreaName(name ? name.name : '');
        }
    }, [documentTypes, selectedDocumentType, activeFileName]);

    const handleCommentChange = (key, value, fileName) => {
        console.log(key, value, fileName,comments);
        setComments(prevComments => ({
            ...prevComments,
            [fileName]: {
                ...prevComments[fileName],
                [key]: value,
            },
        }));
    }
    const generateDocx = async () => {
        console.log(docRefs.current.innerHTML)
        // Create a new document
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun(docRefs.current.innerText),
                            // Add more dynamic references here
                        ],
                    }),
                ],
            }],
        });

        try {
            const blob = await Packer.toBlob(doc);
            const blobUrl = URL.createObjectURL(blob);

            // Create a link element to trigger the open action
            const link = document.createElement('a');
            link.href = blobUrl;
            link.target = '_blank'; // Open in a new tab
            link.download = activeFileName + ' Summary.docx'; // This hint can still help in some cases

            // Simulate a click on the link
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating document:", error);
        }
    };
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Rajiv Code End
    const handleActiveQuestionList = (key, file) => {
        setActiveFileName(file);

    }
    const handleDeleteFIleList = async (key, file) => {
        // setActiveFileName(file);    
        const formData = new FormData();
        formData.append('fileName', file);

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
                setActiveFileName(dataFileName[0]);
            } else {

            }
        } catch (error) {

        }
    }
    
    const saveComment = async()=>{
        console.log(comments);
        // setActiveFileName(file);    
        const formData = new FormData();
        formData.append('comments',JSON.stringify(comments));
        const bodyData = {'comments':JSON.stringify(comments)};
        try {
            // Send data to server
            const response = await fetch(`https://dev.ciceroai.net/api/commentResponse/${responseId}`, {
                method: 'POST',
                body:JSON.stringify({ comments }),
                credentials: 'include', // Include credentials (cookies)
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'), // Set the XSRF token from the cookie
                },
            });

            if (response.ok) {
                const updatedData = await response.json();
                console.log(updatedData);
            } else {

            }
        } catch (error) {

        }
    }

    console.log(responseQuestion);
    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mx-3 pt-2" >
                        <h3 className="fs24 ps-4">{titleDoc[activeFileName]}</h3>
                    </Col>
                </Row>
            </Container>
            <Container fluid>
                <Row>
                    <Col md={7} className="right-content">
                        <Row className="RightPanelSide bg-white mx-2 rounded-25 shadow-sm">
                            {/* Main Content */}
                            <div className="d-flex align-items-center justify-content-between gap-2">
                                <h3 className="doctype-heading charcoal-blue">{selectedPracticeAreaName}</h3>
                                <div className="d-flex align-items-center justify-content-end case-download-options">
                                    <button onClick={handlePrintComplete} className="bg-transparent border-0">
                                        <svg width="18" height="25" viewBox="0 0 18 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.43398 18.5696C8.14583 18.5696 7.95973 18.5951 7.84953 18.6203V22.3554C7.95995 22.3809 8.13781 22.3809 8.29851 22.3809C9.46705 22.3892 10.2294 21.7458 10.2294 20.3821C10.2377 19.1962 9.54339 18.5696 8.43398 18.5696Z" fill="black" />
                                            <path d="M3.44466 18.5527C3.18227 18.5527 3.0044 18.578 2.91098 18.6033V20.2889C3.02126 20.3142 3.15686 20.3229 3.34248 20.3229C4.02906 20.3229 4.45233 19.9755 4.45233 19.3912C4.45237 18.8662 4.08797 18.5527 3.44466 18.5527Z" fill="black" />
                                            <path d="M17.4864 6.25128C17.485 6.14121 17.4501 6.0325 17.3745 5.94657L12.7469 0.660958C12.746 0.659477 12.7442 0.658998 12.7433 0.657647C12.7157 0.626841 12.684 0.601438 12.65 0.579041C12.6399 0.572505 12.6293 0.566623 12.6187 0.560653C12.5893 0.544706 12.5585 0.53146 12.5259 0.521786C12.5176 0.519259 12.5093 0.515686 12.5006 0.51342C12.4657 0.504967 12.4294 0.5 12.3931 0.5H1.0204C0.501532 0.5 0.0792236 0.922352 0.0792236 1.44122V23.5588C0.0792236 24.0779 0.501532 24.5 1.0204 24.5H16.5498C17.0686 24.5 17.491 24.0779 17.491 23.5588V6.304C17.491 6.28631 17.4882 6.26897 17.4864 6.25128ZM5.20606 20.7123C4.76579 21.1272 4.1136 21.3139 3.3512 21.3139C3.18205 21.3139 3.02915 21.3051 2.91103 21.2886V23.3295H1.63216V17.6971C2.03003 17.6296 2.58933 17.5786 3.37713 17.5786C4.17307 17.5786 4.74061 17.7311 5.12161 18.0358C5.48601 18.3239 5.73098 18.7982 5.73098 19.357C5.73098 19.9163 5.5451 20.3906 5.20606 20.7123ZM10.6523 22.6521C10.0516 23.1516 9.1369 23.3888 8.01925 23.3888C7.35002 23.3888 6.87599 23.3465 6.55359 23.3042V17.6971C7.02797 17.6213 7.64653 17.5786 8.29851 17.5786C9.38204 17.5786 10.0852 17.7734 10.636 18.1884C11.229 18.6289 11.6017 19.3318 11.6017 20.3396C11.6013 21.4324 11.2033 22.1861 10.6523 22.6521ZM15.9385 18.6797H13.7446V19.9839H15.7942V21.0345H13.7446V23.3295H12.4491V17.6213H15.9385V18.6797ZM1.0204 16.4805V1.44122H11.9225V6.25668C11.9225 6.51642 12.133 6.72727 12.3931 6.72727H16.5498L16.5503 16.4805H1.0204Z" fill="black" />
                                            <path d="M13.6132 10.6149C13.5856 10.6123 12.9225 10.5518 11.9046 10.5518C11.5856 10.5518 11.2644 10.558 10.9473 10.57C8.93716 9.06146 7.29071 7.55179 6.40927 6.70574C6.42535 6.61258 6.43642 6.53894 6.44156 6.48238C6.55781 5.25515 6.42858 4.42666 6.05873 4.01986C5.81655 3.75402 5.46087 3.66557 5.08997 3.76688C4.85965 3.82722 4.43329 4.05067 4.29677 4.50552C4.14605 5.00818 4.38832 5.61825 5.02479 6.3257C5.0349 6.33641 5.25089 6.56273 5.64335 6.94622C5.38827 8.16247 4.72056 10.7871 4.3966 12.0474C3.63568 12.454 3.0017 12.9438 2.51089 13.5056L2.47874 13.5424L2.45795 13.5865C2.40741 13.6927 2.1658 14.2439 2.34719 14.6867C2.43002 14.888 2.58523 15.035 2.79608 15.1123L2.85259 15.1275C2.85259 15.1275 2.90357 15.1385 2.9932 15.1385C3.38579 15.1385 4.35485 14.9322 4.87464 13.0167L5.00056 12.5314C6.81489 11.6495 9.08282 11.365 10.7267 11.2858C11.5723 11.9128 12.4137 12.4889 13.229 12.999L13.2556 13.0144C13.2951 13.0346 13.6527 13.2111 14.0714 13.2115C14.6697 13.2115 15.1067 12.8443 15.2694 12.2044L15.2777 12.1607C15.3232 11.795 15.2313 11.4653 15.012 11.2076C14.5503 10.6648 13.6904 10.6175 13.6132 10.6149ZM3.00784 14.4323C3.00418 14.4279 3.00244 14.4238 3.00061 14.4192C2.96157 14.3252 3.00841 14.0972 3.07734 13.9302C3.37329 13.5993 3.72854 13.2956 4.13847 13.0221C3.73926 14.3144 3.15869 14.4261 3.00784 14.4323ZM5.54256 5.84626C4.92949 5.16382 4.93869 4.82548 4.97167 4.71158C5.02579 4.52121 5.27006 4.44927 5.27215 4.44862C5.3952 4.41515 5.46989 4.42173 5.53638 4.49472C5.68675 4.6599 5.8159 5.15842 5.76487 6.07284C5.62012 5.9274 5.54256 5.84626 5.54256 5.84626ZM5.22579 11.6577L5.23638 11.6173L5.23498 11.6178C5.54195 10.4154 5.98466 8.65497 6.23921 7.52412L6.2484 7.53288L6.24932 7.52748C7.07284 8.30299 8.33559 9.43732 9.84752 10.6171L9.83053 10.6178L9.85554 10.6367C8.43123 10.757 6.73006 11.0378 5.22579 11.6577ZM14.5797 12.0521C14.4712 12.4507 14.2626 12.5051 14.0714 12.5051C13.8494 12.5051 13.6358 12.4127 13.587 12.3904C13.0319 12.0425 12.4639 11.6633 11.8908 11.2576C11.8954 11.2576 11.8995 11.2576 11.9046 11.2576C12.8871 11.2576 13.5415 11.3173 13.5672 11.3191C13.7313 11.3252 14.2506 11.4019 14.4744 11.665C14.5622 11.7681 14.5957 11.8914 14.5797 12.0521Z" fill="black" />
                                        </svg>
                                    </button>
                                    <button className="bg-transparent border-0" onClick={handlePrint} >
                                        <svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.4007 9.08468H19.8244V6.30404C19.8244 6.28671 19.8217 6.26924 19.8196 6.25151C19.8187 6.14121 19.7833 6.03278 19.7077 5.94686L15.0802 0.660951C15.0788 0.659594 15.0774 0.659113 15.0765 0.657668C15.0489 0.626852 15.0168 0.601202 14.9827 0.579053C14.9726 0.572312 14.9625 0.566665 14.9519 0.560712C14.9225 0.544735 14.8912 0.531297 14.8591 0.521624C14.8503 0.519347 14.8425 0.515758 14.8338 0.513482C14.7989 0.505165 14.7626 0.5 14.7259 0.5H3.35358C2.83431 0.5 2.41243 0.92236 2.41243 1.44119V9.08442H1.83621C1.09335 9.08442 0.490997 9.68655 0.490997 10.4297V17.425C0.490997 18.1674 1.09335 18.7702 1.83621 18.7702H2.41243V23.5588C2.41243 24.0777 2.83431 24.5 3.35358 24.5H18.883C19.4018 24.5 19.8241 24.0777 19.8241 23.5588V18.7702H20.4004C21.1431 18.7702 21.7455 18.1678 21.7455 17.4251V10.4299C21.7456 9.6866 21.1435 9.08468 20.4007 9.08468ZM3.35358 1.44119H14.2553V6.25642C14.2553 6.51643 14.4661 6.72701 14.7259 6.72701H18.883V9.08464H3.35358V1.44119ZM12.888 14.2735C11.9634 13.9513 11.36 13.4398 11.36 12.6301C11.36 11.6803 12.1527 10.9537 13.4662 10.9537C14.0935 10.9537 14.5562 11.0856 14.8862 11.2344L14.6056 12.25C14.3828 12.1429 13.9864 11.9857 13.4414 11.9857C12.8963 11.9857 12.6321 12.2335 12.6321 12.5226C12.6321 12.8778 12.946 13.0346 13.6642 13.3071C14.6468 13.6706 15.1093 14.1825 15.1093 14.9669C15.1093 15.9003 14.3908 16.6931 12.863 16.6931C12.2272 16.6931 11.5997 16.5281 11.2858 16.3544L11.5416 15.314C11.8803 15.4872 12.4007 15.661 12.9373 15.661C13.5159 15.661 13.821 15.4215 13.821 15.058C13.8212 14.7114 13.557 14.5129 12.888 14.2735ZM10.7581 15.5533V16.6107H7.28088V11.044H8.5449V15.5533H10.7581ZM3.24327 16.6107H1.8064L3.4167 13.7938L1.86396 11.0438H3.30937L3.79634 12.0597C3.96153 12.3983 4.0855 12.6705 4.21778 12.9848H4.23384C4.36634 12.6296 4.47358 12.3819 4.61357 12.0597L5.08438 11.0438H6.5213L4.95215 13.7605L6.60412 16.6102H5.15079L4.64675 15.6025C4.44062 15.2149 4.30839 14.9256 4.15142 14.6035H4.135C4.01923 14.9256 3.87915 15.2149 3.70555 15.6025L3.24327 16.6107ZM18.883 23.304H3.35358V18.7702H18.883V23.304H18.883ZM18.8915 16.6107L18.3876 15.603C18.1812 15.215 18.0491 14.9261 17.8921 14.6039H17.8761C17.7603 14.9261 17.6197 15.215 17.446 15.603L16.9841 16.6107H15.5468L17.1571 13.7938L15.6045 11.0438H17.0498L17.5374 12.0597C17.7024 12.3983 17.826 12.6705 17.9584 12.9848H17.9749C18.1068 12.6296 18.2139 12.3819 18.3545 12.0597L18.8251 11.0438H20.2624L18.6932 13.7605L20.3448 16.6102H18.8915V16.6107Z" fill="black" />
                                        </svg>
                                    </button>
                                    <button className="bg-transparent border-0" onClick={generateDocx}>
                                        <svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.655 9.08468H20.0787V6.30404C20.0787 6.28658 20.076 6.26924 20.0736 6.25151C20.0727 6.14112 20.0375 6.03265 19.9619 5.94686L15.3347 0.660863C15.3333 0.659507 15.3319 0.659025 15.331 0.657668C15.3034 0.626852 15.2713 0.601114 15.2372 0.579053C15.2272 0.572181 15.217 0.566534 15.2065 0.560712C15.177 0.544735 15.1457 0.531297 15.1136 0.521624C15.1049 0.519347 15.097 0.515758 15.0884 0.513394C15.0534 0.505165 15.0171 0.5 14.9804 0.5H3.6081C3.08882 0.5 2.66695 0.92236 2.66695 1.44119V9.08442H2.09073C1.34787 9.08442 0.745514 9.68655 0.745514 10.4295V17.4248C0.745514 18.1674 1.34787 18.7702 2.09073 18.7702H2.66695V23.5588C2.66695 24.0777 3.08882 24.5 3.6081 24.5H19.1375C19.6563 24.5 20.0786 24.0777 20.0786 23.5588V18.7702H20.6549C21.3976 18.7702 22 18.1678 22 17.4251V10.4298C22.0001 9.68681 21.3976 9.08468 20.655 9.08468ZM3.6081 1.44141H14.5098V6.25664C14.5098 6.51664 14.7206 6.72723 14.9804 6.72723H19.1375V9.08486H3.6081V1.44141ZM15.4612 15.2008C15.8045 15.2008 16.1855 15.1264 16.4096 15.0363L16.581 15.9249C16.3723 16.0289 15.9021 16.1415 15.29 16.1415C13.5502 16.1415 12.6548 15.059 12.6548 13.6258C12.6548 11.9088 13.879 10.9533 15.402 10.9533C15.9914 10.9533 16.4396 11.0731 16.6412 11.1774L16.4099 12.0809C16.1784 11.9834 15.8577 11.8943 15.4542 11.8943C14.5507 11.8943 13.8494 12.439 13.8494 13.5588C13.8491 14.5657 14.4464 15.2008 15.4612 15.2008ZM12.1389 13.4991C12.1389 15.1486 11.1385 16.1489 9.66821 16.1489C8.175 16.1489 7.30161 15.0214 7.30161 13.5885C7.30161 12.0806 8.26438 10.9531 9.75024 10.9531C11.296 10.9531 12.1389 12.1105 12.1389 13.4991ZM2.33708 16.0446V11.1026C2.75519 11.0355 3.30003 10.9986 3.8748 10.9986C4.83035 10.9986 5.44977 11.17 5.93451 11.536C6.45737 11.9239 6.7861 12.5437 6.7861 13.4318C6.7861 14.3945 6.43518 15.0593 5.94983 15.4697C5.4197 15.9099 4.61355 16.1193 3.62792 16.1193C3.0387 16.1191 2.62064 16.0816 2.33708 16.0446ZM19.1375 23.304H3.6081V18.7702H19.1375V23.304H19.1375ZM20.0003 16.0666L19.5447 15.156C19.3581 14.8053 19.2386 14.5436 19.0969 14.2527H19.0819C18.9774 14.5441 18.8508 14.8053 18.694 15.156L18.2759 16.0666H16.977L18.4326 13.5209L17.0295 11.0353H18.3361L18.7763 11.9538C18.9257 12.2593 19.0373 12.5059 19.1569 12.7895H19.1715C19.291 12.4685 19.3884 12.2447 19.5148 11.9538L19.9404 11.0353H21.2397L19.8212 13.491L21.314 16.0666H20.0003Z" fill="black" />
                                            <path d="M5.5766 13.4688C5.58383 12.424 4.97193 11.8713 3.99423 11.8713C3.74005 11.8713 3.57612 11.8938 3.47894 11.9163V15.208C3.57638 15.2303 3.73309 15.2303 3.87495 15.2303C4.90509 15.2381 5.5766 14.671 5.5766 13.4688Z" fill="black" />
                                            <path d="M8.50406 13.5658C8.50406 14.5513 8.96695 15.2454 9.72833 15.2454C10.4973 15.2454 10.9372 14.5143 10.9372 13.5363C10.9372 12.6328 10.5045 11.8564 9.72027 11.8564C8.95154 11.8567 8.50406 12.5883 8.50406 13.5658Z" fill="black" />
                                        </svg>
                                    </button>
                                    <button className="bg-transparent border-0">
                                        <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.75 4.26564C13.7479 3.57529 14.3058 3.01389 14.9962 3.01173C15.6865 3.00956 16.2479 3.56745 16.25 4.2578L13.75 4.26564Z" fill="#DCA11C" />
                                            <path d="M17.8948 13.3689L16.2837 14.99L16.25 4.25781L13.75 4.26565L13.7837 14.9978L12.1626 13.3868C11.6729 12.9002 10.8814 12.9026 10.3948 13.3924C9.90816 13.882 9.91064 14.6735 10.4003 15.1601L10.4035 15.1632L10.4047 15.1645L15.0488 19.7795L19.6508 15.1484L19.6578 15.1414L19.6588 15.1404L19.6598 15.1394L19.6672 15.132L17.8948 13.3689Z" fill="#DCA11C" />
                                            <path d="M19.668 15.1312C20.1547 14.6414 20.1522 13.8499 19.6625 13.3633C19.1728 12.8767 18.3813 12.8792 17.8948 13.3689L19.668 15.1312Z" fill="#DCA11C" />
                                            <path d="M5.00003 15.5C5.00003 14.1193 6.11932 13 7.50003 13C8.19038 13 8.75003 12.4404 8.75003 11.75C8.75003 11.0596 8.19038 10.5 7.50003 10.5C4.73861 10.5 2.50003 12.7386 2.50003 15.5V23C2.50003 25.7614 4.73861 28 7.50003 28H21.25C24.7018 28 27.5 25.2017 27.5 21.75V15.5C27.5 12.7386 25.2614 10.5 22.5 10.5C21.8097 10.5 21.25 11.0596 21.25 11.75C21.25 12.4404 21.8097 13 22.5 13C23.8808 13 25 14.1193 25 15.5V21.75C25 23.8211 23.3212 25.5 21.25 25.5H7.50003C6.11932 25.5 5.00003 24.3807 5.00003 23V15.5Z" fill="#DCA11C" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {/* <div className="upload-section mb-4">
                                {fileName && <span className="ml-2">{fileName.name}</span>}
                                <span className='upload-hidden-btn position-relative d-flex justify-content-between'>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: 'none' }}
                                    // onChange={handleFileUpload}
                                    />
                                    <Button variant="primary" className="p-0">
                                        <label htmlFor="fileInput" className="upload-document d-flex align-items-center gap-2 fs14 px-2 py-2">
                                            <span>
                                                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.5 1H8H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H3.5M9.5 1L15 6.625M9.5 1V5.625C9.5 6.17728 9.9477 6.625 10.5 6.625H15M15 6.625V7.75V10V17C15 18.1046 14.1046 19 13 19H12.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M8 19V11M8 11L10.5 13.5M8 11L5.5 13.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </span> Upload Document
                                        </label>
                                    </Button>
                                </span>
                            </div> */}

                            {/* Questions Table */}
                            <div className="d-flex mt-2">
                                {fileName.length > 0 && fileName.map((item, key) => {
                                    return (
                                        <span className={`fs18 position-relative pe-2 ${(activeFileName == item ? 'active' : '')}`} style={{ marginLeft: '8px' }} data-file={item} onClick={() => handleActiveQuestionList(key, item)} key={key}>
                                            {item}
                                            <span className='position-absolute close-doc' onClick={() => handleDeleteFIleList(key, item)} key={key}>
                                                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.4" d="M9.75 16.5C13.8921 16.5 17.25 13.1421 17.25 9C17.25 4.85786 13.8921 1.5 9.75 1.5C5.60786 1.5 2.25 4.85786 2.25 9C2.25 13.1421 5.60786 16.5 9.75 16.5Z" fill="#B0B0B0" />
                                                    <path d="M10.5445 9.00007L12.2695 7.27508C12.487 7.05758 12.487 6.69758 12.2695 6.48008C12.052 6.26258 11.692 6.26258 11.4745 6.48008L9.74955 8.20507L8.02452 6.48008C7.80702 6.26258 7.44702 6.26258 7.22953 6.48008C7.01203 6.69758 7.01203 7.05758 7.22953 7.27508L8.95455 9.00007L7.22953 10.7251C7.01203 10.9426 7.01203 11.3026 7.22953 11.5201C7.34203 11.6326 7.48452 11.6851 7.62702 11.6851C7.76952 11.6851 7.91202 11.6326 8.02452 11.5201L9.74955 9.79507L11.4745 11.5201C11.587 11.6326 11.7295 11.6851 11.872 11.6851C12.0145 11.6851 12.157 11.6326 12.2695 11.5201C12.487 11.3026 12.487 10.9426 12.2695 10.7251L10.5445 9.00007Z" fill="#292D32" />
                                                </svg>
                                            </span>
                                        </span>
                                    )
                                })}

                            </div>
                            <div ref={contentCompleteRef} className="d-flex flex-column">
                                
                                <div className="d-flex position-relative flex-column">
                                    <div className="d-flex justify-content-end gap-3">      
                                    <span>                          
                                        <Link
                                            to={`/response/${responseId}/`}
                                            title="Edit"
                                        >
                                            
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                    </svg>
                                            
                                        </Link>
                                    </span>
                                    <span>
                                    <button
                                        onClick={saveComment}
                                        title="Save"
                                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                        aria-label="Save comment"
                                        >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-floppy2-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M12 2h-2v3h2z" />
                                            <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1" />
                                        </svg>
                                        </button>
                                        </span>
                                    </div>  
                                    <Table bordered ref={contentRef} className="mt-2">
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Question</th>
                                                <th>Response</th>
                                                <th>Comments</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {activeFileName !== '' && responseQuestion.questions?.[activeFileName] &&
                                                Array.isArray(responseQuestion.questions[activeFileName]) && responseQuestion.questions[activeFileName].map((q, key) => {
                                                    console.log(key)
                                                    return (
                                                        <tr >
                                                            <td>{parseInt(key) + 1}</td>
                                                            <td>{q.questions}</td>
                                                            <td>{responseQuestion.answers[activeFileName][key]}</td>
                                                            <td className="p-2 text-center">
                                                            <button
                                                                style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                                                                onClick={handleShow}
                                                                title="Add Comment"
                                                                aria-label="Add Comment"
                                                                >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="currentColor"
                                                                    className="bi bi-plus-square"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                                                </svg>
                                                                </button>
                                                            {show && ( 
                                                                <Modal 
                                                                    show={show}
                                                                    onHide={handleClose}
                                                                    backdrop=""
                                                                    keyboard={false}
                                                                    style={{backgroundColor: 'rgba(0, 0, 0, 0.1)'}}
                                                                >
                                                                    <Modal.Header closeButton>
                                                                        <Modal.Title>Add Comment</Modal.Title>
                                                                    </Modal.Header>
                                                                    <Modal.Body>
                                                                        <Form.Control
                                                                            as="textarea"
                                                                            value={comments[activeFileName]?.[key] || ''} // Fetch dynamically
                                                                            onChange={(e) => handleCommentChange(key, e.target.value, activeFileName)}
                                                                            placeholder="Add comment"
                                                                            style={{ height: '100px' }} 
                                                                        />
                                                                    </Modal.Body>
                                                                    <Modal.Footer>
                                                                        <Button variant="secondary" onClick={handleClose}>
                                                                            Close
                                                                        </Button>
                                                                        <Button variant="primary" onClick={handleClose}>
                                                                            Save Changes
                                                                        </Button>
                                                                    </Modal.Footer>
                                                                </Modal>
                                                            )}

                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                )}
                                        </tbody>
                                    </Table>
                                </div>
                                {/* AI Analysis Section */}
                                <div className="ai-analysis mt-4" ref={docRefs}>
                                    <h5>AI Analysis: Accuracy of Party Identification</h5>
                                    <p>
                                        {responseQuestion.length !== 0 && responseQuestion.summary[activeFileName]}
                                    </p>
                                </div>
                                <div className="ai-analysis mt-4 pt-4 border-top border-2">
                                    <h3 className="fs20">References</h3>
                                    {/* AI Analysis Section */}
                                    <div className="ai-analysis mt-4">
                                        {activeFileName !== '' && responseQuestion.questions?.[activeFileName] &&
                                            Array.isArray(responseQuestion.questions[activeFileName]) && responseQuestion.references[activeFileName].map((q, key) => {
                                                console.log(key)
                                                return (
                                                    <>
                                                        <h5 className="fs18">{parseInt(key) + 1}. {q.reference_title}</h5>
                                                        <p>
                                                            {q.reference_content}
                                                        </p>
                                                    </>

                                                )
                                            })}

                                    </div>
                                </div>
                            </div>
                            {/* Print Button */}
                        </Row>
                    </Col>
                    <Col md={5} className="right-content">
                        <Row className="RightPanelSide bg-white rounded-25 shadow-sm">
                            {activeFileName != '' && <DocumentHighlighter document={activeFileName} id={responseId}></DocumentHighlighter>}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>

    );
};

export default LegalChatbotGPT;