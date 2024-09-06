import React from 'react';

const CustomButton = ({ label, onClick, styleType = 'primary' }) => {
    return (
        <button className={`btn btn-${styleType}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default CustomButton;
