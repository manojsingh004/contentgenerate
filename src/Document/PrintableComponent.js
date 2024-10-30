import React from "react";

const PrintableComponent = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <h2>Printable Content</h2>
        <p>This content will be printed to PDF or paper.</p>
    </div>
));

export default PrintableComponent;