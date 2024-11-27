import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const ChatContext = createContext();

// Provider component
export const ChatProvider = ({ children }) => {
    const [selectedPracticeArea, setSelectedPracticeArea] = useState(0);
    const [selectedDocumentType, setSelectedDocumentType] = useState(0);
    
    const [selectedPracticeAreaName, setSelectedPracticeAreaName] = useState('');
    const [selectedDocumentTypeName, setSelectedDocumentTypeName] = useState('');

    const [titleDoc, setTitleDoc] = useState('');

    const [practiceArea, setPracticeArea] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [fileName, setFileName] = useState([]);
    const [activeFileName, setActiveFileName] = useState('');
    const [filePath, setFilePath] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null); // New state to store the uploaded file
    const [isUploaded, setIsUploaded] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [fileQuestions, setFileQuestions] = useState([]);
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
            console.log('datadoc',response.data)
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
    const resetState = () => {
        setSelectedPracticeArea(0);
        setSelectedDocumentType(0);
        setSelectedPracticeAreaName('');
        setSelectedDocumentTypeName('');
        setTitleDoc('');
        setPracticeArea([]);
        setDocumentTypes([]);
        setFileName([]);
        setActiveFileName('');
        setFilePath([]);
        setUploadedFile(null);
        setIsUploaded(false);
        setQuestions([]);
        setFileQuestions([]);
        setNewQuestion("");
        setResponseQuestion([]);
        setChatId(null);
    };
    
    // Call this function when moving to the next page
    const moveToNextPage = () => {
        resetState();
        // Add your page navigation logic here
    };

    // Handle file upload
    const handleFileChange = (selectedFile) => {
        if (selectedFile) {
            const dataFileName = JSON.parse(selectedFile.original_file_name);
            setFileName(dataFileName); // Save the file name(s) in state
    
            // Create a deep copy of the current file questions to avoid direct mutation
            const updatedFileQuestions = { ...fileQuestions };
    
            // Iterate over each file name in the parsed array
            dataFileName.forEach((fileName) => {
                // Check if the file name already exists as a key in fileQuestions
                if (!updatedFileQuestions[fileName]) {
                    // If it doesn't exist, add it with an empty array as the default question list
                    updatedFileQuestions[fileName] = questions;
                }
            });
            if(activeFileName===''){
                setActiveFileName(dataFileName[0]);
            }
            console.log(updatedFileQuestions,'test46')
            // Set the updated file questions to the state
            setFileQuestions(updatedFileQuestions);
            setUploadedFile(selectedFile); // Save the actual file in the state
            setIsUploaded(true);
        }
    };
    //handle question
    const handleSetQuestions = (newQuestions) => {
        setQuestions(newQuestions);
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
            setPracticeArea,
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
            titleDoc, setTitleDoc,
            handleFileChange,
            chatId, setChatId,setResponseQuestion,responseQuestion,
            selectedPracticeAreaName,setSelectedPracticeAreaName,
            selectedDocumentTypeName,setSelectedDocumentTypeName,
            questions,setUploadedFile, handleSetQuestions,
            fetchQuestion,activeFileName, setActiveFileName,
            handleAddQuestion,fileQuestions, setFileQuestions,
            newQuestion,
            setNewQuestion,filePath, setFilePath,moveToNextPage
        }}>
            {children}
        </ChatContext.Provider>
    );
};