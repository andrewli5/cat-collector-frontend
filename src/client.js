import axios from "axios";
import { LOCAL_API_URL } from "./constants";

export const BASE_API_URL = process.env.REACT_APP_API_URL || LOCAL_API_URL;
export const USERS_API = `${BASE_API_URL}/users`;
export const CATS_API = `${BASE_API_URL}/cats`;
const REQUEST = axios.create({
  withCredentials: true,
});

// LOCAL FUNCTIONS
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const storeCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearBrowserStorage = () => {
  localStorage.clear();
};

// USERS API FUNCTIONS
export const updateUserCoins = async (username, coins) => {
  const response = await REQUEST.put(`${USERS_API}/${username}/coins`, {
    coins: coins,
  });
  return response.data;
};

export const signIn = async (credentials) => {
  const response = await REQUEST.post(`${USERS_API}/signin`, credentials);
  return response.data;
};

export const signUpAsUser = async (user) => {
  const response = await REQUEST.post(`${USERS_API}/signup-user`, user);
  return response.data;
};

export const signUpAsAdmin = async (user) => {
  const response = await REQUEST.post(`${USERS_API}/signup-admin`, user);
  return response.data;
};

export const signOut = async () => {
  const response = await REQUEST.post(`${USERS_API}/signout`);
  return response.data;
};

export const findAllUsers = async () => {
  const response = await REQUEST.get(`${USERS_API}`);
  return response.data;
};

export const updateUser = async (username, updatedFields) => {
  const response = await REQUEST.put(`${USERS_API}/${username}`, updatedFields);
  return response.data;
};

// CATS API FUNCTIONS
export const getCatsByUsername = async (username) => {
  const response = await REQUEST.get(`${CATS_API}/${username}`);
  return response.data;
};
