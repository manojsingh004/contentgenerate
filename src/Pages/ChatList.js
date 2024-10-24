import React, { useState } from 'react';
import { Table, FormControl, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaBell, FaEdit, FaTrash } from 'react-icons/fa';

const ChatList = () => {
  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10); // State to manage items per page

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
  };

  const documents = [
    {
      name: 'Created Chatbot GPT',
      docType: 'Contract of Sale',
      files: ['word-1.doc', 'abcd-02.doc'],
      notifications: 4,
    },
    {
      name: 'Offering a lease to own',
      docType: 'Title Deeds',
      files: ['word-1.doc', 'abcd-02.doc'],
      notifications: 0,
    },
    {
      name: 'Instruction for security safety devices',
      docType: 'Property Information Form',
      files: ['word-1.doc', 'abcd-02.doc'],
      notifications: 2,
    },
    {
      name: 'Create POS System',
      docType: 'Local Authority Searches',
      files: ['word-1.doc', 'abcd-02.doc'],
      notifications: 0,
    },
    {
      name: 'GP Notes on McCarry’s work',
      docType: 'Mortgage Offer',
      files: ['word-1.doc', 'abcd-02.doc'],
      notifications: 0,
    },
  ];

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayedDocuments = filteredDocuments.slice(0, itemsPerPage);

  return (
    <div className="document-table-container px-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Conveyancing</h3>
        <FormControl
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="w-25"
        />
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
            {displayedDocuments.map((doc, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex justify-content-between fw-semibold">
                    <div className="d-flex align-items-center gap-2">
                      <span className="dot"></span> {doc.name}{' '}
                    </div>
                    {doc.notifications > 0 && (
                      <span className="position-relative">
                        <b className="position-absolute bell-count">{doc.notifications}</b>
                        <FaBell className="notification-bell mr-3" />
                      </span>
                    )}
                  </div>
                </td>
                <td>{doc.docType}</td>
                <td>
                  <div className="d-flex gap-2 uploaded-file-icon">
                    {doc.files.map((file, fileIndex) => (
                      <span key={fileIndex} className="file-icon">
                        <Button className="light-cyan-bg text-white d-flex align-items-center gap-2 position-relative">
                          <svg width="13" height="16" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M4.55556 11.6667L6.33333 13.4444L9.88889 9.88889M8.11111 1H3.84444C2.8488 1 2.35097 1 1.97068 1.19377C1.63617 1.3642 1.3642 1.63617 1.19377 1.97068C1 2.35097 1 2.8488 1 3.84444V14.1556C1 15.1512 1 15.6491 1.19377 16.0293C1.3642 16.3638 1.63617 16.6358 1.97068 16.8062C2.35097 17 2.8488 17 3.84444 17H10.6C11.5956 17 12.0935 17 12.4738 16.8062C12.8083 16.6358 13.0803 16.3638 13.2507 16.0293C13.4444 15.6491 13.4444 15.1512 13.4444 14.1556V6.33333M8.11111 1L13.4444 6.33333M8.11111 1V4.91111C8.11111 5.40893 8.11111 5.65785 8.208 5.84799C8.29324 6.01524 8.42916 6.15123 8.59644 6.23645C8.78658 6.33333 9.03547 6.33333 9.53333 6.33333H13.4444"
                              stroke="#052044"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="midnight-blue">{file}</span>
                        </Button>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="text-center">
                  <FaEdit className="action-icon mx-1" />
                  <FaTrash className="action-icon mx-1" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-between align-items-center px-4 py-2">
          <span className="pagination-drop-show d-flex align-items-center gap-2">Showing 
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
             of {filteredDocuments.length}</span>
          <div className="d-flex align-items-center gap-2">
            <div className="pagination-controls d-flex gap-2">
              <button>{'<'}</button>
              <button>1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>5</button>
              <button>{'>'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
