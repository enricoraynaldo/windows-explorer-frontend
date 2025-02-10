import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/folders";

export const fetchRootFolders = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data; // Only root folders
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
