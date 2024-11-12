import React from 'react';
import './nombre.css'; // Asegúrate de crear este archivo para el estilo

const HeaderName = ({ name }) => {
  return (
    <div className="header-name">
      {name}
    </div>
  );
};

export default HeaderName;