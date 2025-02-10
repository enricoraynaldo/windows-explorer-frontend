import { useState } from "react";
import FolderTree from "./FolderTree";
import FileList from "./FileList";

function Explorer() {
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <FolderTree onFolderSelect={setSelectedFolderId} />
      <FileList selectedFolderId={selectedFolderId} />
    </div>
  );
}

export default Explorer;
