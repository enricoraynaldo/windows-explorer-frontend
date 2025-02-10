const API_BASE_URL = "http://localhost:8080/api/v1/folders"; // Adjust if needed

export async function fetchRootFolders() {
    const response = await fetch(API_BASE_URL);
    return response.json();
  }
  
  export async function fetchSubfolders(folderId) {
    const response = await fetch(`${API_BASE_URL}/${folderId}/subfolders`);
    return response.json();
  }
  
  export async function fetchFiles(folderId) {
    const response = await fetch(`${API_BASE_URL}/${folderId}/files`);
    return response.json();
  }
