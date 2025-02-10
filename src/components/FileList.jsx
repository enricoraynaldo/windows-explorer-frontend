import { useEffect, useState } from "react";
import { fetchFiles } from "../api";

function FileList({ selectedFolderId }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (selectedFolderId) {
      fetchFiles(selectedFolderId).then(setFiles).catch(console.error);
    }
  }, [selectedFolderId]);

  return (
    <div style={{ width: "70%", padding: "10px" }}>
      <h3>Files</h3>
      {selectedFolderId ? (
        files.length > 0 ? (
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                {file.name} ({file.fileType}, {file.sizeKb} KB)
              </li>
            ))}
          </ul>
        ) : (
          <p>No files found.</p>
        )
      ) : (
        <p>Select a folder to view files.</p>
      )}
    </div>
  );
}

export default FileList;
