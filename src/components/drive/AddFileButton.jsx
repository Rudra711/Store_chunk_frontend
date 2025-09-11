// src/components/drive/AddFileButton.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressBar, Toast } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";
import { useUser } from "../../lib/context/user";
import api from "../../lib/context/api";
export default function AddFileButton({ currentFolder, refresh }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { user } = useUser();

  const getFileCategory = (mimeType) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType === "application/pdf" || mimeType.startsWith("application/")) return "document";
    return "other";
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const toastId = uuidV4();
    setUploadingFiles((prev) => [
      ...prev,
      { id: toastId, name: file.name, progress: 0, error: false },
    ]);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folderId", currentFolder?._id === "root" ? "" : currentFolder?._id || "");

      await api.post("/files", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const progress = evt.loaded / evt.total;
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === toastId ? { ...f, progress } : f))
          );
        },
      });

      setUploadingFiles((prev) => prev.filter((f) => f.id !== toastId));
      refresh && (await refresh());
    } catch (err) {
      console.error(err);
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === toastId ? { ...f, error: true, progress: 1 } : f))
      );
    } finally {
      // reset the file input so user can re-upload same file if needed
      e.target.value = "";
    }
  };

  return (
    <>
      <label className="btn btn-outline-success btn-sm m-0 me-2">
        <FontAwesomeIcon icon={faFileUpload} className="me-2" />
        Upload File
        <input type="file" onChange={handleUpload} style={{ display: "none" }} />
      </label>

      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
              zIndex: 9999,
              maxWidth: "260px",
            }}
          >
            {uploadingFiles.map((file) => (
              <Toast
                key={file.id}
                bg={file.error ? "danger" : "light"}
                autohide={!file.error}
                delay={5000}
              >
                <Toast.Header>
                  <strong className="me-auto">{file.name}</strong>
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={!file.error && file.progress < 1}
                    variant={file.error ? "danger" : "primary"}
                    now={Math.round(file.progress * 100)}
                    label={file.error ? "Failed" : `${Math.round(file.progress * 100)}%`}
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
