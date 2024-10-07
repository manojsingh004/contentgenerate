import React, { useState, useEffect } from 'react';
import { Upload, Plus, Minus, RefreshCw, Save, CheckCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const practiceAreas = [
  { id: 'conveyancing', name: 'Conveyancing' },
  { id: 'corporateLaw', name: 'Corporate Law' },
  { id: 'employmentLaw', name: 'Employment Law' },
  { id: 'intellectualProperty', name: 'Intellectual Property' },
  { id: 'familyLaw', name: 'Family Law' },
];

const documentTypes = {
  conveyancing: [
    { id: 'titleDeeds', name: 'Title Deeds' },
    { id: 'contractOfSale', name: 'Contract of Sale' },
    { id: 'propertyInfo', name: 'Property Information Form' },
    { id: 'localSearches', name: 'Local Authority Searches' },
    { id: 'mortgageOffer', name: 'Mortgage Offer' },
  ],
  corporateLaw: [
    { id: 'articlesOfIncorporation', name: 'Articles of Incorporation' },
    { id: 'shareholderAgreements', name: 'Shareholder Agreements' },
    { id: 'financialStatements', name: 'Financial Statements' },
    { id: 'taxReturns', name: 'Tax Returns' },
    { id: 'employmentContracts', name: 'Employment Contracts' },
  ],
  employmentLaw: [
    { id: 'employmentContract', name: 'Employment Contract' },
    { id: 'employeeHandbook', name: 'Employee Handbook' },
    { id: 'disciplinaryRecords', name: 'Disciplinary Records' },
    { id: 'payrollRecords', name: 'Payroll Records' },
    { id: 'performanceReviews', name: 'Performance Reviews' },
  ],
  intellectualProperty: [
    { id: 'patentApplications', name: 'Patent Applications' },
    { id: 'trademarkRegistrations', name: 'Trademark Registrations' },
    { id: 'copyrightFilings', name: 'Copyright Filings' },
    { id: 'licenseAgreements', name: 'License Agreements' },
    { id: 'ipAssignments', name: 'IP Assignments' },
  ],
  familyLaw: [
    { id: 'marriageCertificate', name: 'Marriage Certificate' },
    { id: 'divorceDecree', name: 'Divorce Decree' },
    { id: 'childCustodyAgreement', name: 'Child Custody Agreement' },
    { id: 'financialDisclosures', name: 'Financial Disclosures' },
    { id: 'prenuptialAgreement', name: 'Prenuptial Agreement' },
  ],
};

const preBuiltQuestions = {
  conveyancing: {
    titleDeeds: [
      "Is the chain of ownership clear and complete?",
      "Are there any restrictive covenants or easements?",
      "Are there any outstanding mortgages or charges?",
    ],
    contractOfSale: [
      "Are all parties correctly named and described?",
      "Is the property accurately described, including its boundaries?",
      "Are all relevant clauses included (e.g., completion date, price, deposit)?",
    ],
    // Add more questions for other conveyancing document types...
  },
  corporateLaw: {
    articlesOfIncorporation: [
      "Are the company's name and registered address correct?",
      "Are the company's objectives clearly stated?",
      "Is the share structure accurately described?",
    ],
    shareholderAgreements: [
      "Are voting rights clearly defined?",
      "Are there provisions for the transfer of shares?",
      "Is there a clear process for resolving disputes between shareholders?",
    ],
    // Add more questions for other corporate law document types...
  },
  employmentLaw: {
    employmentContract: [
      "Are the job title and responsibilities clearly defined?",
      "Are the terms of compensation and benefits clearly stated?",
      "Are there clear provisions for termination of employment?",
    ],
    employeeHandbook: [
      "Does it cover all required policies (e.g., anti-discrimination, health and safety)?",
      "Are disciplinary procedures clearly outlined?",
      "Is the handbook up to date with current employment laws?",
    ],
    // Add more questions for other employment law document types...
  },
  // Add more questions for other practice areas...
};

const GeneralLegalDueDiligenceTool = () => {
  const [practiceArea, setPracticeArea] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [customQuestions, setCustomQuestions] = useState({});
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (practiceArea && selectedDocType) {
      const savedQuestions = customQuestions[`${practiceArea}-${selectedDocType}`] || [];
      const defaultQuestions = (preBuiltQuestions[practiceArea] && preBuiltQuestions[practiceArea][selectedDocType]) || [];
      setQuestions([...defaultQuestions, ...savedQuestions].map(q => ({ question: q, isPreBuilt: defaultQuestions.includes(q) })));
    } else {
      setQuestions([]);
    }
  }, [practiceArea, selectedDocType, customQuestions]);

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handlePracticeAreaChange = (event) => {
    setPracticeArea(event.target.value);
    setSelectedDocType('');
  };

  const handleDocTypeChange = (event) => {
    setSelectedDocType(event.target.value);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], question: value };
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', isPreBuilt: false }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSaveCustomQuestions = () => {
    const customQs = questions.filter(q => !q.isPreBuilt).map(q => q.question);
    setCustomQuestions({ ...customQuestions, [`${practiceArea}-${selectedDocType}`]: customQs });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulating API call for document review
    setTimeout(() => {
      const newResponses = questions.map(({ question }) => ({
        question,
        answer: `AI-generated response to: "${question}"`,
      }));
      setResponses(newResponses);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">General Legal Due Diligence Tool</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Practice Area</h2>
        <select
          value={practiceArea}
          onChange={handlePracticeAreaChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select practice area</option>
          {practiceAreas.map(area => (
            <option key={area.id} value={area.id}>{area.name}</option>
          ))}
        </select>
      </div>

      {practiceArea && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          <div className="flex items-center justify-center w-full mb-4">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
              <Upload className="w-8 h-8"/>
              <span className="mt-2 text-base leading-normal">Select files</span>
              <input type='file' className="hidden" onChange={handleFileUpload} multiple />
            </label>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Uploaded Files:</h3>
              <ul className="list-disc pl-5">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="text-green-600">
                    <CheckCircle className="inline-block mr-2" size={16} />
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {practiceArea && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Document Type</h2>
          <select
            value={selectedDocType}
            onChange={handleDocTypeChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select document type</option>
            {documentTypes[practiceArea].map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedDocType && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Due Diligence Questions</h2>
          {questions.map((question, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder="Enter your question"
                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!question.isPreBuilt && (
                <button
                  onClick={() => handleRemoveQuestion(index)}
                  className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <Minus size={20} />
                </button>
              )}
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              onClick={handleAddQuestion}
              className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              <Plus size={20} />
              <span>Add Custom Question</span>
            </button>
            <button
              onClick={handleSaveCustomQuestions}
              className="flex items-center space-x-1 text-green-500 hover:text-green-700 focus:outline-none"
            >
              <Save size={20} />
              <span>Save Custom Questions</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedDocType || questions.length === 0 || isLoading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {isLoading ? <RefreshCw className="animate-spin inline mr-2" size={20} /> : null}
        {isLoading ? 'Analyzing...' : 'Start AI Analysis'}
      </button>

      {responses.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">AI Analysis Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-b border-gray-300 px-4 py-2 text-left">Question</th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left">AI Response</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border-b border-gray-300 px-4 py-2">{response.question}</td>
                    <td className="border-b border-gray-300 px-4 py-2">{response.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralLegalDueDiligenceTool;