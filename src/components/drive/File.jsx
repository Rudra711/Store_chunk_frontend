// src/components/drive/File.jsx
import React, { useState, useMemo } from "react";
import { Button, Modal, Form, Card, Dropdown } from "react-bootstrap";
import { faEdit, faTrash, faDownload, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../lib/context/api";
import { toast } from "react-hot-toast";

export default function File({ file, refresh }) {
  const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const isPreviewable = useMemo(() => {
    return file.type === "image" || file.extension?.toLowerCase() === "pdf";
  }, [file.type, file.extension]);

  const BASE_URL = "http://localhost:5000";
  const fileViewUrl = `${BASE_URL}${file.fileUrl}`;

  // ✅ Secure download with JWT
  const handleDownload = async () => {
    try {
      const res = await api.get(`/files/${file._id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name); // original name
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Download started");
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/files/${file._id}`);
      toast.success("File deleted");
      refresh && (await refresh());
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to delete");
    }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/files/${file._id}`, { name: newName.trim() });
      toast.success("File renamed");
      setShowRename(false);
      refresh && (await refresh());
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Rename failed");
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        {isPreviewable && (
          <Card.Img
            variant="top"
            src={fileViewUrl}
            onClick={() => window.open(fileViewUrl, "_blank")}
            style={{ height: "150px", objectFit: "cover", cursor: "pointer" }}
          />
        )}
        <Card.Body className="position-relative">
          <Card.Title className="text-truncate" title={file.name}>
            {file.name}
          </Card.Title>

          <Dropdown className="position-absolute top-0 end-0">
            <Dropdown.Toggle variant="link" size="sm" className="text-muted">
              <FontAwesomeIcon icon={faEllipsisV} />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Header>{file.name}</Dropdown.Header>
              <Dropdown.Item onClick={() => setShowRename(true)}>
                <FontAwesomeIcon icon={faEdit} className="me-2 text-success" /> Rename
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDownload}>
                <FontAwesomeIcon icon={faDownload} className="me-2 text-primary" /> Download
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleDelete} className="text-danger">
                <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Body>
      </Card>

      {/* Rename Modal */}
      <Modal show={showRename} onHide={() => setShowRename(false)}>
        <Form onSubmit={handleRename}>
          <Modal.Header closeButton>
            <Modal.Title>Rename File</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>New File Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRename(false)}>Cancel</Button>
            <Button variant="success" type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
