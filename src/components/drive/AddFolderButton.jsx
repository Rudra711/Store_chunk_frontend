// src/components/drive/AddFolderButton.jsx
import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../lib/context/user";
import api from "../../lib/context/api";
import { toast } from "react-hot-toast";

export default function AddFolderButton({ currentFolder, refresh }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { user } = useUser();

  const openModal = () => setOpen(true);
  const closeModal = () => { setOpen(false); setName(""); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in.");

    try {
      await api.post("/folders", {
        name: name.trim(),
        parentId: currentFolder?._id === "root" ? null : currentFolder?._id || null,
      });

      toast.success("Folder created");
      closeModal();
      refresh && (await refresh());
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create folder");
    }
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm" className="ms-2">
        <FontAwesomeIcon icon={faFolderPlus} className="me-2" />
        New Folder
      </Button>

      <Modal show={open} onHide={closeModal} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Folder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter folder name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="success" type="submit">Create</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
