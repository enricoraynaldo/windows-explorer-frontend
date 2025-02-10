import { useEffect, useState } from "react";
import FolderTree from "./components/FolderTree";
import FileList from "./components/FileList";

const App = () => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/folders")
      .then((res) => res.json())
      .then((data) => setFolders(data));
  }, []);

  const handleFolderSelect = (folderId) => {
    setSelectedFolder(folderId);
    fetch(`http://localhost:8080/api/v1/folders/${folderId}/files`)
      .then((res) => res.json())
      .then((data) => setFiles(data));
  };

  return (
    <div className="explorer">
      <div className="panel left">
        <h2>Folders</h2>
        <FolderTree folders={folders} onSelect={handleFolderSelect} />
      </div>
      <div className="panel right">
        <h2>Files</h2>
        <FileList files={files} />
      </div>
    </div>
  );
};

export default App;
