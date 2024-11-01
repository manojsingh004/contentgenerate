import { useState } from 'react';
import { PdfLoader, PdfHighlighter, Tip } from 'react-pdf-highlighter';
import { pdfjs } from 'react-pdf';

// Set the worker path for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentHighlighter = ({ document }) => {
  const [highlights, setHighlights] = useState([]);
  const searchString = "your search term"; // Replace this with the actual term

  // Function to search and highlight all matching terms
  const searchAndHighlight = (textContent, pageNumber) => {
    const matches = [];
    let startIndex = 0;

    // Loop to find each instance of searchString
    while (startIndex !== -1) {
      startIndex = textContent.indexOf(searchString, startIndex);
      if (startIndex !== -1) {
        const endIndex = startIndex + searchString.length;

        // Here you would need to calculate the bounding rects based on the match's position
        matches.push({
          id: Math.random().toString(36).substr(2, 9),
          position: {
            boundingRect: { top: 0, left: 0, width: 50, height: 20 }, // Dummy values, replace with actual
            rects: [{ top: 0, left: 0, width: 50, height: 20 }], // Dummy values, replace with actual
            pageNumber: pageNumber,
          },
          content: { text: searchString },
        });
        startIndex = endIndex;
      }
    }
    setHighlights(prevHighlights => [...prevHighlights, ...matches]);
  };

  return (
    <PdfLoader
      url={`https://dev.ciceroai.net/user-content/${document}`}
      beforeLoad={<div>Loading document...</div>}
    >
      {({ pdfDocument }) => (
        <PdfHighlighter
          pdfDocument={pdfDocument}
          highlights={highlights}
          onHighlightChange={highlight => {
            // Handle highlight changes
            console.log(highlight);
          }}
          onScrollChange={pageNumber => {
            // When the user scrolls to a new page, you might want to update highlights
          }}
          onDocumentLoadSuccess={async (doc) => {
            const pdf = await pdfjs.getDocument({ url: doc.url }).promise;
            const numPages = pdf.numPages;

            // Loop through pages to get full text content
            const pagePromises = [];
            for (let i = 1; i <= numPages; i++) {
              pagePromises.push(pdf.getPage(i).then(async (page) => {
                const content = await page.getTextContent();
                const textItems = content.items.map(item => item.str).join(' ');
                searchAndHighlight(textItems, i);
              }));
            }

            // Wait for all pages to be processed
            await Promise.all(pagePromises);
          }}
        >
          <Tip>
            {/* Custom tip rendering can be done here */}
            Highlighted
          </Tip>
        </PdfHighlighter>
      )}
    </PdfLoader>
  );
};

export default DocumentHighlighter;