import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js';
import 'pdfjs-dist/build/pdf.worker.entry';

// Set the workerSrc to use the locally imported worker
// pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

const PDFPreview = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  return (
    <>
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error('Error loading PDF:', error)}
      >
        {numPages &&
          Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
      </Document>
    </>
  );
};

export default PDFPreview;
