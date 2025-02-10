import { useEffect, useState } from "react";
import {
  fetchRootFolders,
  fetchFilesByFolder,
  fetchSubfolders,
} from "./api";

const FileExplorer = () => {
  const [folders, setFolders] = useState([]); // Root folders
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [subfolders, setSubfolders] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch only root folders
    fetchRootFolders()
      .then(setFolders)
      .catch((err) => console.error("Error fetching folders:", err));
  }, []);

  const handleFolderClick = async (folder) => {
    setSelectedFolder(folder);

    try {
      const [filesData, subfoldersData] = await Promise.all([
        fetchFilesByFolder(folder.id),
        fetchSubfolders(folder.id),
      ]);

      setFiles(filesData);
      setSubfolders(subfoldersData);
    } catch (err) {
      console.error("Error fetching folder details:", err);
    }
  };

  return (
    <div className="container">
      {/* Sidebar: Root folders */}
      <div className="sidebar">
        <h2>Folders</h2>
        <ul>
          {folders.map((folder) => (
            <li key={folder.id} onClick={() => handleFolderClick(folder)}>
              📁 {folder.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content: Subfolders + Files */}
      <div className="main-content">
        <h2>{selectedFolder ? selectedFolder.name : "Files"}</h2>
        {selectedFolder ? (
          <div>
            {/* Display subfolders */}
            {subfolders.length > 0 && (
              <div>
                  {subfolders.map((sub) => (
                    <li key={sub.id} onClick={() => handleFolderClick(sub)}>
                      📂 {sub.name}
                    </li>
                  ))}
              </div>
            )}

            {/* Display files */}
            {files.length > 0 || subfolders.length > 0 ? (
              files.map((file) => <li key={file.id}>📄 {file.name}</li>)
            ) : (
              <p>No files found.</p>
            )}
          </div>
        ) : (
          <p>Select a folder to view files.</p>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
