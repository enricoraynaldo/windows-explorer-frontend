import { useState } from "react";

const FolderTree = ({ folders, onSelect }) => {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (folderId) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  return (
    <ul className="folder-tree">
      {folders.map((folder) => (
        <li key={folder.id}>
          <div
            className="folder-item"
            onClick={() => {
              toggleFolder(folder.id);
              onSelect(folder.id);
            }}
          >
            📂 {folder.name}
          </div>
          {openFolders[folder.id] && folder.subfolders?.length > 0 && (
            <FolderTree folders={folder.subfolders} onSelect={onSelect} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default FolderTree;
