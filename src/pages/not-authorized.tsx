import React from 'react';
import './NotAuthorized.css'; // Ensure to create this CSS file

const NotAuthorized = () => {
    return (
        <div className="not-authorized-container">
            <h1 className="not-authorized-title">Acceso Denegado</h1>
            <p className="not-authorized-message">No tienes permiso para acceder a esta página.</p>
        </div>
    );
};

export default NotAuthorized;
