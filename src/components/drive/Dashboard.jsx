// src/components/drive/Dashboard.jsx
import React, { useState } from "react";
import { Container, Modal, Form, Button } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import AddFolderButton from "./AddFolderButton";
import AddFileButton from "./AddFileButton";
import Folder from "./Folder";
import File from "./File";
import { useFolder } from "../../hooks/useFolder";
import api from "../../lib/context/api";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { folderId: routeFolderId } = useParams();
  const folderId = routeFolderId ?? "root";
  const location = useLocation();
  const folderFromState = location?.state?.folder || null;

  const { folder, childFolders, childFiles, refresh } = useFolder(folderId, folderFromState);

  const [showRename, setShowRename] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");

  const handleRename = (folder) => {
    setSelectedFolder(folder);
    setNewFolderName(folder.name);
    setShowRename(true);
  };

  const confirmRename = async (e) => {
    e.preventDefault();
    if (!selectedFolder) return;

    try {
      await api.put(`/folders/${selectedFolder._id}`, { name: newFolderName.trim() });
      toast.success("Folder renamed");
      setShowRename(false);
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Rename failed");
    }
  };

  const handleDelete = async (folder) => {
    const ok = window.confirm(`Delete folder "${folder.name}" and its contents?`);
    if (!ok) return;

    try {
      await api.delete(`/folders/${folder._id}`, { params: { recursive: true } });
      toast.success("Folder deleted");
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <>
      <Container fluid className="mt-3">
        <div className="d-flex align-items-center mb-3">
          <FolderBreadcrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder} refresh={refresh} />
          <AddFolderButton currentFolder={folder} refresh={refresh} />
        </div>

        {/* Folders */}
        {childFolders.length > 0 ? (
          <div className="d-flex flex-wrap">
            {childFolders.map((childFolder) => (
              <div key={childFolder._id} className="p-2" style={{ maxWidth: "250px" }}>
                <Folder
                  folder={childFolder}
                  currentFolder={folder}
                  onRename={handleRename}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No folders in this directory.</p>
        )}

        {childFolders.length > 0 && childFiles.length > 0 && <hr />}

        {/* Files */}
        {childFiles.length > 0 ? (
          <div className="d-flex flex-wrap">
            {childFiles.map((childFile) => (
              <div key={childFile._id} className="p-2" style={{ maxWidth: "250px" }}>
                <File file={childFile} refresh={refresh} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No files in this directory.</p>
        )}
      </Container>

      {/* Rename Folder Modal */}
      <Modal show={showRename} onHide={() => setShowRename(false)} centered>
        <Form onSubmit={confirmRename}>
          <Modal.Header closeButton>
            <Modal.Title>Rename Folder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>New Folder Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
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
