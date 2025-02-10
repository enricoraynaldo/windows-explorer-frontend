import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/folders";

export const fetchAllFolders = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const fetchFolderDetails = async (folderId) => {
  const response = await axios.get(`${API_BASE_URL}/${folderId}`);
  return response.data;
};

export const fetchFilesByFolder = async (folderId) => {
  const response = await axios.get(`${API_BASE_URL}/${folderId}/files`);
  return response.data;
};

export const fetchSubfolders = async (parentId) => {
  const response = await axios.get(API_BASE_URL);
  return response.data.filter(folder => folder.parentFolder?.id === parentId);
};

export const fetchRootFolders = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data.filter(folder => folder.parentFolder === null); // Only root folders
};

export const buildFolderTree = (folders) => {
  const folderMap = {};

  // Initialize folderMap with all folders
  folders.forEach((folder) => {
    folderMap[folder.id] = { ...folder, subfolders: [] };
  });

  // Populate subfolders
  folders.forEach((folder) => {
    if (folder.parentFolder) {
      const parentFolderId = folder.parentFolder.id;
      if (folderMap[parentFolderId]) {
        folderMap[parentFolderId].subfolders.push(folderMap[folder.id]);
      }
    }
  });

  // Extract root folders
  const rootFolders = folders.filter((folder) => !folder.parentFolder);

  return rootFolders.map((folder) => folderMap[folder.id]);
};
