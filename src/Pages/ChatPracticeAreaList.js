import React, { useState, useContext, useEffect } from "react";
import {
  Table,
  FormControl,
  Button,
  Dropdown,
  Form,
  DropdownButton,
} from "react-bootstrap";
// import { FaBell, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie"; // Import the js-cookie library
import { ChatContext } from "./../DataContext/ChatContext";


const ChatPracticeAreaList = () => {
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
    newQuestion,setPracticeArea,setDocumentTypes,setUploadedFile,setFileQuestions,
    titleDoc,
    setTitleDoc,
    setNewQuestion,
    handleCommentChange
} = useContext(ChatContext);

  const { practiceAreaId } = useParams();
  // const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10); // State to manage items per page
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [documents, setDocuments] = useState([]); // State to store documents
  const [loadings, setLoadings] = useState(true); // State to track loading
  const [searchQuery, setSearchQuery] = useState("");
  const [totalDocuments, setTotalDocuments] = useState(0); // Add this state

  const navigate = useNavigate();
  useEffect(() => {
    setSelectedPracticeArea(0);
    setSelectedDocumentType(0);
    
    setSelectedPracticeAreaName('');
    setSelectedDocumentTypeName('');

    setTitleDoc('');
    fetchDocumentTypes([]);
   // setPracticeArea([]);
   
    setFileName([]);
    setActiveFileName('');
    setFilePath([]);
    setUploadedFile(null); // New state to store the uploaded file
    setIsUploaded(false);
    setQuestions([]);
    // setFileQuestions(current=>[]);
    setNewQuestion("");
    setResponseQuestion([]);
    setChatId(null);

    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `https://dev.ciceroai.net/api/area/${practiceAreaId}`,
          {
            params: {
              page: currentPage,
              items_per_page: itemsPerPage,
            },
          }
        );

        setDocuments(response.data.data); // Assuming response.data.data contains the list of documents
        setTotalDocuments(response.data.total || response.data.data.length); // Set totalDocuments, adjust according to the API response structure
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoadings(false);
      }
    };

    fetchDocuments();
  }, [practiceAreaId, itemsPerPage, currentPage]);
  const deleteDocument = async (id) => {
    try {
      await axios.get(`https://dev.ciceroai.net/api/response/delete/${id}`);
      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.id !== id)
      ); // Update state to remove the deleted document
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  const handleSearchChange = async () => {
    try {
      const response = await fetch("https://dev.ciceroai.net/api/searchDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },

        body: JSON.stringify({ title: searchQuery, id: practiceAreaId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      setDocuments(data);
      console.log(data);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page on change
  };

  // const filteredDocuments = documents.filter(
  //   (doc) =>
  //     doc && doc.name && doc.name.toLowerCase().includes(search.toLowerCase())
  // );

  // Calculate the indices for pagination
  // const totalDocuments = filteredDocuments.length;
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const displayedDocuments = filteredDocuments.slice(
  //   startIndex,
  //   startIndex + itemsPerPage
  // );

  const totalPages = Math.ceil(totalDocuments / itemsPerPage);

  if (loadings) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="document-table-container">
      <div className="d-flex align-items-center mb-4">
        <h3 className="flex-grow-1 pe-3 m-0">Conveyancing</h3>
        <div className="flex-grow-1">
          <Form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchChange();
            }}
          >
            <FormControl
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-75 searchBox public-sans fs15"
            />
          </Form>
        </div>
      </div>
      <div className="case-list pb-3 mb-4">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Document Type</th>
              <th>Uploaded Files</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => {
              console.log(JSON.parse(doc.title));
              if (JSON.parse(doc.title) != null) {
                const associativeArray = Object.keys(JSON.parse(doc.title)).map(key => (JSON.parse(doc.title)[key]));
                const associativeArrayOriginal = Object.keys(JSON.parse(doc.original_file_name)).map(key => (JSON.parse(doc.original_file_name)[key]));
                return (<tr key={index}>
                  <td>
                    <div className="d-flex justify-content-between fw-semibold">
                      <div className="d-flex align-items-center poppins fs15 gap-2">
                        <span className="dot"></span> {associativeArray[0]}{" "}
                      </div>

                      <span className="position-relative">
                        <b className="position-absolute bell-count">{"0"}</b>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 27 27"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.2741 5.91667C11.2741 4.72005 12.2442 3.75 13.4408 3.75C14.6374 3.75 15.6075 4.72005 15.6075 5.91667C18.1426 7.11543 19.8093 9.61543 19.9408 12.4167V15.6667C20.1061 17.0325 20.9102 18.2387 22.1075 18.9167H4.77412C5.97133 18.2387 6.77546 17.0325 6.94079 15.6667V12.4167C7.07227 9.61543 8.73894 7.11543 11.2741 5.91667"
                            stroke="#4B465C"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.2741 5.91667C11.2741 4.72005 12.2442 3.75 13.4408 3.75C14.6374 3.75 15.6075 4.72005 15.6075 5.91667C18.1426 7.11543 19.8093 9.61543 19.9408 12.4167V15.6667C20.1061 17.0325 20.9102 18.2387 22.1075 18.9167H4.77412C5.97133 18.2387 6.77546 17.0325 6.94079 15.6667V12.4167C7.07227 9.61543 8.73894 7.11543 11.2741 5.91667"
                            stroke="white"
                            stroke-opacity="0.2"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10.1908 18.9167V20C10.1908 21.7949 11.6459 23.25 13.4408 23.25C15.2357 23.25 16.6908 21.7949 16.6908 20V18.9167"
                            stroke="#4B465C"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10.1908 18.9167V20C10.1908 21.7949 11.6459 23.25 13.4408 23.25C15.2357 23.25 16.6908 21.7949 16.6908 20V18.9167"
                            stroke="white"
                            stroke-opacity="0.2"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </td>
                  <td className="fs15 public-sans">{doc.document_type.name}</td>
                  <td>
                    {associativeArrayOriginal.map((item, key) => (<div className="d-flex gap-2 uploaded-file-icon">
                      <span key={index + key} className="file-icon">
                        <Button className="light-cyan-bg text-white d-flex align-items-center gap-2 position-relative">
                          <svg
                            width="13"
                            height="16"
                            viewBox="0 0 15 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.55556 11.6667L6.33333 13.4444L9.88889 9.88889M8.11111 1H3.84444C2.8488 1 2.35097 1 1.97068 1.19377C1.63617 1.3642 1.3642 1.63617 1.19377 1.97068C1 2.35097 1 2.8488 1 3.84444V14.1556C1 15.1512 1 15.6491 1.19377 16.0293C1.3642 16.3638 1.63617 16.6358 1.97068 16.8062C2.35097 17 2.8488 17 3.84444 17H10.6C11.5956 17 12.0935 17 12.4738 16.8062C12.8083 16.6358 13.0803 16.3638 13.2507 16.0293C13.4444 15.6491 13.4444 15.1512 13.4444 14.1556V6.33333M8.11111 1L13.4444 6.33333M8.11111 1V4.91111C8.11111 5.40893 8.11111 5.65785 8.208 5.84799C8.29324 6.01524 8.42916 6.15123 8.59644 6.23645C8.78658 6.33333 9.03547 6.33333 9.53333 6.33333H13.4444"
                              stroke="#052044"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="midnight-blue fs14">
                            {item}
                          </span>
                        </Button>
                      </span>
                    </div>))}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Link to={`/response/${doc.id}/`}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 7.5H6C4.89543 7.5 4 8.39543 4 9.5V18.5C4 19.6046 4.89543 20.5 6 20.5H15C16.1046 20.5 17 19.6046 17 18.5V15.5"
                            stroke="#8B909A"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M9 15.5H12L20.5 6.99998C21.3284 6.17156 21.3284 4.82841 20.5 3.99998C19.6716 3.17156 18.3284 3.17156 17.5 3.99998L9 12.5V15.5"
                            stroke="#8B909A"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M16 5.5L19 8.5"
                            stroke="#8B909A"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </Link>
                      <Button
                        style={{
                          background: "transparent",
                          border: "0",
                          padding: "0",
                        }}
                        onClick={() => deleteDocument(doc.id)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 7.5H20"
                            stroke="#8B909A"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10 11.5V17.5"
                            stroke="#8B909A"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M14 11.5V17.5"
                            stroke="#8B909A"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M5 7.5L6 19.5C6 20.6046 6.89543 21.5 8 21.5H16C17.1046 21.5 18 20.6046 18 19.5L19 7.5"
                            stroke="#8B909A"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M9 7.5V4.5C9 3.94772 9.44772 3.5 10 3.5H14C14.5523 3.5 15 3.94772 15 4.5V7.5"
                            stroke="#8B909A"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>)
              } else {
                return ('')
              }
            })}
          </tbody>
        </Table>
        <div className="d-flex justify-content-between align-items-center px-4 py-2">
          <span className="pagination-drop-show poppins d-flex align-items-center gap-2">
            Showing
            <DropdownButton
              id="dropdown-basic-button"
              title={`${itemsPerPage}`}
              onSelect={(e) => handleItemsPerPageChange(Number(e))}
            >
              <Dropdown.Item eventKey="10">10</Dropdown.Item>
              <Dropdown.Item eventKey="20">20</Dropdown.Item>
              <Dropdown.Item eventKey="30">30</Dropdown.Item>
              <Dropdown.Item eventKey="50">50</Dropdown.Item>
            </DropdownButton>
            of {totalDocuments}
          </span>
          <div className="d-flex align-items-center gap-2">
            <div className="pagination-controls poppins d-flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                {"<"}
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPracticeAreaList;
