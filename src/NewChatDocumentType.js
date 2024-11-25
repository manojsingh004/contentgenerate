import React from 'react';

const NewChatDocumentType = () => {
    return (
        <div className="main-content">
            <h1>New DD Case</h1>
            <div className="form-group">
                <label>Select Practice Area</label>
                <select>
                    <option value="conveyancing">Conveyancing</option>
                    <option value="corporate-law">Corporate Law</option>
                    <option value="employment-law">Employment Law</option>
                    <option value="intellectual-property">Intellectual Property</option>
                </select>
            </div>
            <div className="form-group">
                <label>Select Document Type</label>
                <select>
                    <option value="type1">Type 1</option>
                    <option value="type2">Type 2</option>
                    <option value="type3">Type 3</option>
                </select>
            </div>
        </div>
    );
};

export default NewChatDocumentType;