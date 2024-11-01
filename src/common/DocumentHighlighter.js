import { useState } from 'react';
import { PdfLoader, PdfHighlighter, Tip, AreaHighlight } from 'react-pdf-highlighter';

const DocumentHighlighter = ({ document }) => {
  const [highlights, setHighlights] = useState([]);
  const searchString = "your search term"; // Replace this with the actual term

  // Function to search and highlight all matching terms
  const searchAndHighlight = (textContent) => {
    const matches = [];
    let startIndex = 0;

    // Loop to find each instance of searchString
    while (startIndex !== -1) {
      startIndex = textContent.indexOf(searchString, startIndex);
      if (startIndex !== -1) {
        const endIndex = startIndex + searchString.length;
        
        // Add each match as a highlight object
        matches.push({
          id: Math.random().toString(36).substr(2, 9),
          position: {
            boundingRect: {}, // Populate this based on match coordinates
            rects: [], // Populate based on match position
            pageNumber:'' /* Calculate the page number here */
          },
          content: { text: searchString }
        });
        startIndex = endIndex;
      }
    }
    setHighlights(matches);
  };

  // Call searchAndHighlight when the document is loaded
  const handleDocumentLoad = (doc) => {
    const fullText = doc.getText(); // Modify if method differs
    searchAndHighlight(fullText);
  };

  return (
    <PdfLoader
      url={'https://dev.ciceroai.net/user-content/'+document}
      // any other PdfLoader props
    >
      
        <PdfHighlighter
          // pdfDocument={pdfDocument}
          onHighlightChange={highlight => {
            // Handle highlight changes
          }}
        >
          {/* Optional custom tip component */}
          <Tip>
            {/* Custom tip rendering */}
          </Tip>
        </PdfHighlighter>
      
    </PdfLoader>
    
  );
};

export default DocumentHighlighter;