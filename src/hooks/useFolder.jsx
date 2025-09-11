// src/hooks/useFolder.js
import { useEffect, useState, useCallback } from "react";
import api from "../lib/context/api";

export const ROOT_FOLDER = { _id: "root", name: "Root", path: [] };

export function useFolder(folderId, folderFromState = null) {
  const [folder, setFolder] = useState(folderFromState || ROOT_FOLDER);
  const [childFolders, setChildFolders] = useState([]);
  const [childFiles, setChildFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!folderId || folderId === "root") {
        setFolder(ROOT_FOLDER);
      } else {
        const { data } = await api.get(`/folders/${folderId}`);
        setFolder(data);
      }

      const [foldersRes, filesRes] = await Promise.all([
        api.get(`/folders`, { params: { parentId: folderId === "root" ? "" : folderId } }),
        api.get(`/files`, { params: { folderId: folderId === "root" ? "" : folderId } }),
      ]);

      setChildFolders(foldersRes.data || []);
      setChildFiles(filesRes.data || []);
    } catch (err) {
      console.error(err);
      setChildFolders([]);
      setChildFiles([]);
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => { load(); }, [load]);

  return {
    folder,
    childFolders,
    childFiles,
    loading,
    refresh: load,
  };
}
