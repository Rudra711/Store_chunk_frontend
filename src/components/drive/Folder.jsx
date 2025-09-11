// src/components/drive/Folder.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { faEllipsisV, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Folder({ folder, currentFolder, onRename, onDelete }) {
  const fullPath = Array.isArray(currentFolder?.path) ? [...currentFolder.path] : [];
  if (currentFolder && currentFolder._id !== "root") {
    fullPath.push({ _id: currentFolder._id, name: currentFolder.name });
  }

  return (
    <div className="border rounded p-2 bg-light d-flex justify-content-between align-items-center">
      <Link
        to={{
          pathname: `/folder/${folder._id}`,
          state: {
            folder: {
              ...folder,
              path: fullPath,
            },
          },
        }}
        className="text-decoration-none flex-grow-1 text-truncate me-2"
      >
        📁 {folder.name}
      </Link>

      <Dropdown align="end">
        <Dropdown.Toggle
          variant="light"
          size="sm"
          className="border-0 shadow-none p-0"
          style={{ background: "transparent" }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => onRename(folder)}>
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Rename
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onDelete(folder)}>
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
