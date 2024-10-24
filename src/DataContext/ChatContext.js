import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const ChatContext = createContext();

// Provider component
export const ChatProvider = ({ children }) => {
    const [selectedPracticeArea, setSelectedPracticeArea] = useState(0);
    const [selectedDocumentType, setSelectedDocumentType] = useState(0);
    const [practiceArea, setPracticeArea] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [fileName, setFileName] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null); // New state to store the uploaded file
    const [isUploaded, setIsUploaded] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [responseQuestion, setResponseQuestion] = useState([]);
    const [chatId, setChatId] = useState(null);

    // Fetch practice areas
    useEffect(() => {
        const fetchPracticeAreas = async () => {
            try {
                const response = await axios.get('https://dev.ciceroai.net/api/area-of-practice');
                setPracticeArea(response.data);
            } catch (error) {
                console.error("Error fetching practice areas:", error);
            }
        };

        fetchPracticeAreas();
    }, []);

    const fetchDocumentTypes = async (practiceAreaId) => {
        try {
            const response = await axios.get(`https://dev.ciceroai.net/api/document-types/${practiceAreaId}`);
            setDocumentTypes(response.data);
        } catch (error) {
            console.error("Error fetching document types:", error);
        }
    };

    const fetchQuestion = async (documentId) => {
        try {
            const response = await axios.get(`https://dev.ciceroai.net/api/get-question/${documentId}/${selectedPracticeArea}`);
            setQuestions(response.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    // Handle file upload
    const handleFileChange = (selectedFile) => {
        if (selectedFile) {
            setFileName(selectedFile.name);  // Save the file name
            setUploadedFile(selectedFile);   // Save the actual file in the state
            setIsUploaded(true);
        }
    };

    const handleAddQuestion = () => {
        if (newQuestion.trim()) {
            setQuestions([...questions, newQuestion]);
            setNewQuestion(""); // Clear input field
        }
    };

    return (
        <ChatContext.Provider value={{
            selectedPracticeArea,
            setSelectedPracticeArea,
            selectedDocumentType,
            setSelectedDocumentType,
            practiceArea,
            setFileName,
            documentTypes,
            fetchDocumentTypes,
            fileName,
            uploadedFile,  // Provide the uploaded file in the context
            isUploaded,
            setIsUploaded,
            setQuestions,
            handleFileChange,
            chatId, setChatId,setResponseQuestion,responseQuestion,
            questions,setUploadedFile,
            fetchQuestion,
            handleAddQuestion,
            newQuestion,
            setNewQuestion
        }}>
            {children}
        </ChatContext.Provider>
    );
};