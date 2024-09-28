
"use client"; // Asegúrate de que el componente sea un Client Component

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faUser,
  faUserFriends,
  faIdCard,
  faEdit,
  faTrash,
  faSyncAlt,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import Menu from "../modals/menu/menu.jsx";
import "./informacion.css";

const InfoPage: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [companyName, setCompanyName] = useState("DevMinds S.R.L.");
  const [ownerName, setOwnerName] = useState("Abel Alejandro Pacheco Quispe");
  const [instructorName, setInstructorName] = useState(
    "Corina Justina Flores Villarroel"
  );
  const [id, setId] = useState("ID: CPTIS-0893-2024");
  const [image, setImage] = useState("/LOGO.jpeg"); // Agrega el estado para la imagen
  const [members, setMembers] = useState([
    {
      name: "Abel Alejandro Pacheco Quispe",
      role: "Developer",
      status: "Activo",
      invited: false,
      editingRole: false,
      originalRole: "Developer",
    },
    {
      name: "Julio Cesar Severiche Orellana",
      role: "Developer",
      status: "Invitación enviada",
      invited: true,
      editingRole: false,
      originalRole: "Developer",
    },
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    // Restaurar los valores originales
    setCompanyName("DevMinds S.R.L.");
    setOwnerName("Abel Alejandro Pacheco Quispe");
    setInstructorName("Corina Justina Flores Villarroel");
    setId("ID: CPTIS-0893-2024");
  };
  const handleSave = () => setEditing(false); // Implementar lógica para guardar cambios

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = URL.createObjectURL(event.target.files[0]);
      setImage(file); // Actualiza la imagen con el archivo seleccionado
    }
  };

  const handleRoleChange = (index: number, newRole: string) => {
    setMembers((prevMembers) =>
      prevMembers.map((member, i) =>
        i === index ? { ...member, role: newRole } : member
      )
    );
  };

  const handleInviteMember = () => {
    if (newMemberEmail) {
      setMembers((prevMembers) => [
        ...prevMembers,
        {
          name: newMemberEmail,
          role: "",
          status: "Invitación enviada",
          invited: true,
          editingRole: false,
          originalRole: "",
        },
      ]);
      setNewMemberEmail("");
    }
  };

  const handleDeleteMember = (index: number) => {
    setMembers((prevMembers) =>
      prevMembers.filter((_, i) => i !== index)
    );
  };

  const toggleRoleEditing = (index: number) => {
    setMembers((prevMembers) =>
      prevMembers.map((member, i) =>
        i === index
          ? { ...member, editingRole: !member.editingRole, originalRole: member.role }
          : member
      )
    );
  };

  const handleRoleEditSave = (index: number) => {
    setMembers((prevMembers) =>
      prevMembers.map((member, i) =>
        i === index ? { ...member, editingRole: false } : member
      )
    );
  };

  const handleRoleEditCancel = (index: number) => {
    setMembers((prevMembers) =>
      prevMembers.map((member, i) =>
        i === index
          ? { ...member, editingRole: false, role: member.originalRole }
          : member
      )
    );
  };

  return (
    <div className="info-page">
      <Menu />
      <div className="info-container">
        <h1 className="info-title">Grupo-Empresa</h1>
        <div className="info-card">
          <img src={image} alt="Logo de la Empresa" className="info-logo" />
          {editing && (
            <label htmlFor="image-upload" className="image-upload-label">
              <FontAwesomeIcon icon={faCamera} className="change-image-icon" />
              <input
                type="file"
                id="image-upload"
                onChange={handleImageChange}
                accept="image/*"
                className="image-upload-input"
                style={{ display: "none" }} // Oculta el input de archivo
              />
            </label>
          )}
          <div className="info-details">
            <div className="info-item">
              <FontAwesomeIcon icon={faBuilding} className="info-icon" />
              {editing ? (
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input-field"
                />
              ) : (
                <span>{companyName}</span>
              )}
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faUser} className="info-icon" />
              {editing ? (
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="input-field"
                />
              ) : (
                <span>{ownerName}</span>
              )}
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faUserFriends} className="info-icon" />
              {editing ? (
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  className="input-field"
                />
              ) : (
                <span>{instructorName}</span>
              )}
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faIdCard} className="info-icon" />
              {editing ? (
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="input-field"
                />
              ) : (
                <span>{id}</span>
              )}
            </div>
          </div>
          <div className="info-actions">
            {editing ? (
              <>
                <button className="icon-btn save-btn" onClick={handleSave}>
                  Guardar
                </button>
                <button className="icon-btn cancel-btn" onClick={handleCancel}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button className="icon-btn edit-btn" onClick={handleEdit}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="icon-btn delete-btn">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </>
            )}
          </div>
        </div>

        <h2 className="members-title">Miembros</h2>
        <ul className="members-list">
          {members.map((member, index) => (
            <li key={index} className="member-item">
              <div className="member-info">
                <FontAwesomeIcon icon={faUser} className="member-avatar" />
                <span>{member.name}</span>
                <span className="status">{member.status}</span>
                <div className="member-actions">
                  {member.invited ? (
                    <>
                      <button className="icon-btn resend-btn">
                        <FontAwesomeIcon icon={faSyncAlt} />
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDeleteMember(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  ) : (
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => handleDeleteMember(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              </div>
              {member.status === "Activo" && (
                <div className="inline-elements">
                  <span className="role-text">
                    Rol actual: {member.role || "Sin rol asignado"}
                  </span>
                  {member.editingRole ? (
                    <>
                      <select
                        className="role-select"
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(index, e.target.value)
                        }
                      >
                        <option value="">Ninguno</option>
                        <option value="Developer">Developer</option>
                        <option value="Scrum Master">Scrum Master</option>
                        <option value="Product Owner">Product Owner</option>
                      </select>
                      <div className="role-buttons">
                        <button
                          className="save-btn"
                          onClick={() => handleRoleEditSave(index)}
                        >
                          Guardar
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleRoleEditCancel(index)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      className="icon-btn edit-btn"
                      onClick={() => toggleRoleEditing(index)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="invite-member">
          <input
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Correo electrónico del nuevo miembro"
            className="input-field"
          />
          <button className="invite-btn" onClick={handleInviteMember}>
            Invitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
