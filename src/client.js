import axios from "axios";
import { LOCAL_API_URL } from "./constants";

export const BASE_API_URL = process.env.REACT_APP_API_URL || LOCAL_API_URL;
export const USERS_API = `${BASE_API_URL}/users`;

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const storeCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearBrowserStorage = () => {
  localStorage.clear();
};

const request = axios.create({
  withCredentials: true,
});

export const updateUserCoins = async (username, coins) => {
  const response = await request.put(`${USERS_API}/${username}/coins`, {coins: coins});
  return response.data;
};

export const signIn = async (credentials) => {
  const response = await request.post(`${USERS_API}/signin`, credentials);
  return response.data;
};

export const signUpAsUser = async (user) => {
  const response = await request.post(`${USERS_API}/signup-user`, user);
  return response.data;
};

export const signUpAsAdmin = async (user) => {
  const response = await request.post(`${USERS_API}/signup-admin`, user);
  return response.data;
};

export const signOut = async () => {
  const response = await request.post(`${USERS_API}/signout`);
  return response.data;
};

export const account = async () => {
  const response = await request.post(`${USERS_API}/account`);
  return response.data;
};

export const updateUser = async (user) => {
  const response = await request.put(`${USERS_API}/${user._id}`, user);
  return response.data;
};

export const findAllUsers = async () => {
  const response = await request.get(`${USERS_API}`);
  return response.data;
};

export const createUser = async (user) => {
  const response = await request.post(`${USERS_API}`, user);
  return response.data;
};

export const findUserById = async (id) => {
  const response = await request.get(`${USERS_API}/${id}`);
  return response.data;
};

export const deleteUser = async (user) => {
  const response = await request.delete(`${USERS_API}/${user._id}`);
  return response.data;
};
