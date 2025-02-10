import { useState } from "react";

const FolderTree = ({ folders, onFolderSelect }) => {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (folderId) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
    onFolderSelect(folderId); // Pass selected folder to Explorer
  };

  return (
    <ul className="folder-tree">
      {folders.map((folder) => (
        <li key={folder.id}>
          <div
            className="folder-item"
            onClick={() => toggleFolder(folder.id)}
          >
            📂 {folder.name}
          </div>
          {openFolders[folder.id] && folder.subfolders?.length > 0 && (
            <FolderTree folders={folder.subfolders} onFolderSelect={onFolderSelect} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default FolderTree;
