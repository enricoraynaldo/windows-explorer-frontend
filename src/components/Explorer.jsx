import { useState, useEffect } from "react";
import FolderTree from "./FolderTree";
import FileList from "./FileList";
import { fetchFolders } from "../api"; // Import API call

function Explorer() {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  useEffect(() => {
    fetchFolders()
      .then(setFolders)
      .catch((err) => console.error("Error fetching folders:", err));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <FolderTree folders={folders} onFolderSelect={setSelectedFolderId} />
      <FileList selectedFolderId={selectedFolderId} />
    </div>
  );
}

export default Explorer;
