import { useEffect, useState } from "react";
import {
  fetchAllFolders,
  fetchFilesByFolder,
  fetchSubfolders,
  buildFolderTree
} from "./api";

const FileExplorer = () => {
  const [folders, setFolders] = useState([]); // Root folders
  const [expandedFolders, setExpandedFolders] = useState({}); // Track expanded state
  const [folderMap, setFolderMap] = useState({}); // Store subfolders
  const [hasSubfoldersMap, setHasSubfoldersMap] = useState({}); // Track subfolder existence
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [searchTermRight, setSearchTermRight] = useState("");

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const allFolders = await fetchAllFolders();
        const rootFolders = buildFolderTree(allFolders);
        setFolders(rootFolders);

        // Check for subfolders for each folder
        allFolders.forEach((folder) => {
          if (folder.parentFolder) {
            const parentFolderId = folder.parentFolder.id;
            setHasSubfoldersMap((prev) => ({
              ...prev,
              [parentFolderId]: true,
            }));
          }
        });
      } catch (err) {
        console.error("Error fetching folders:", err);
      }
    };

    loadFolders();
  }, []);

  // Toggle expand/collapse and fetch subfolders
  const toggleExpand = async (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId], // Toggle state
    }));

    // Fetch subfolders only if they haven't been loaded
    if (!folderMap[folderId]) {
      try {
        const subfoldersData = await fetchSubfolders(folderId);
        setFolderMap((prev) => ({ ...prev, [folderId]: subfoldersData }));
        setHasSubfoldersMap((prev) => ({
          ...prev,
          [folderId]: subfoldersData.length > 0,
        }));
      } catch (err) {
        console.error("Error fetching subfolders:", err);
      }
    }
  };

  // Handle folder selection to fetch files and subfolders
  const handleFolderClick = async (folder) => {
    setSelectedFolder(folder);
    setSearchTermRight(""); // Reset search input

    try {
      const filesData = await fetchFilesByFolder(folder.id);
      setFiles(filesData);

      // Fetch subfolders for the selected folder
      const subfoldersData = await fetchSubfolders(folder.id);
      setFolderMap((prev) => ({ ...prev, [folder.id]: subfoldersData }));
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Render folder tree recursively
  const renderFolderTree = (folderList, level = 0) => (
    <ul className={`folder-list ${level > 0 ? "nested-folder" : ""}`}>
      {folderList.map((folder) => {
        const isExpanded = expandedFolders[folder.id];
        const hasSubfolders = hasSubfoldersMap[folder.id];

        return (
          <li key={folder.id}>
            <div className="folder-item">
              {/* Expand/collapse arrow only appears if there are subfolders */}
              {hasSubfolders && (
                <span
                  className="folder-arrow"
                  onClick={() => toggleExpand(folder.id)}
                >
                  {isExpanded ? "▼" : "▶"}
                </span>
              )}

              {/* Folder name */}
              <span onClick={() => handleFolderClick(folder)}>
                📁 {folder.name}
              </span>
            </div>

            {/* Render subfolders when expanded */}
            {isExpanded && folder.subfolders && (
              <ul className="nested-folder">
                {renderFolderTree(folder.subfolders, level + 1)}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  // Get the subfolders of the selected folder
  const subfolders = selectedFolder ? folderMap[selectedFolder.id] || [] : [];

  // Filter subfolders and files based on search term
  const filteredSubfolders = subfolders.filter((subfolder) =>
    subfolder.name.toLowerCase().includes(searchTermRight.toLowerCase())
  );

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTermRight.toLowerCase())
  );

  return (
    <div className="container">
      {/* Sidebar: Folder List */}
      <div className="sidebar">
        <h2>Folders</h2>
        {renderFolderTree(folders)}
      </div>

      {/* Main Content: Subfolders + Files */}
      <div className="main-content">
        <h2>{selectedFolder ? selectedFolder.name : "Files"}</h2>

        {/* Search bar */}
        <input
          type="text"
          className="search-bar"
          placeholder="Search folders and files..."
          value={searchTermRight}
          onChange={(e) => setSearchTermRight(e.target.value)}
        />

        {selectedFolder && (
          <>
            {/* Subfolders and files */}
            <ul className="folder-list">
              {filteredSubfolders.map((subfolder) => (
                <li key={subfolder.id} onClick={() => handleFolderClick(subfolder)}>
                  📁 {subfolder.name}
                </li>
              ))}
              {filteredFiles.length === 0 && filteredSubfolders.length === 0 ? (
                <p className="empty-message">Nothing to show.</p>
              ) : (
                filteredFiles.map((file) => (
                  <li key={file.id}>📄 {file.name}</li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
