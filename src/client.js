import axios from "axios";
import { LOCAL_API_URL } from "./constants";
import { importAll } from "./utils/importAll";
import { useLocation } from "react-router-dom";

export const BASE_API_URL = process.env.REACT_APP_API_URL || LOCAL_API_URL;
export const USERS_API = `${BASE_API_URL}/users`;
export const CATS_API = `${BASE_API_URL}/cats`;

const REQUEST = axios.create({
  withCredentials: true,
});

// LOCAL FUNCTIONS
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  if (!user) {
    return null;
  }
  return JSON.parse(localStorage.getItem("user"));
};

export const storeCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearBrowserStorage = () => {
  localStorage.clear();
};

// USERS API FUNCTIONS
export const updateUserCoinsByUserId = async (
  userId,
  coins,
  completionHandler,
) => {
  const response = await REQUEST.put(`${USERS_API}/${userId}/coins`, {
    coins: coins,
  });
  completionHandler();
  return response.data;
};

export const signIn = async (credentials) => {
  const response = await REQUEST.post(`${USERS_API}/signin`, credentials);
  return response.data;
};

export const getUserDataByUserId = async (userId) => {
  const response = await REQUEST.get(`${USERS_API}/${userId}/data`);
  return response.data;
};

export const signUpAsUser = async (user) => {
  const response = await REQUEST.post(`${USERS_API}/signup/user`, user);
  return response.data;
};

export const signUpAsAdmin = async (user) => {
  const response = await REQUEST.post(`${USERS_API}/signup/admin`, user);
  return response.data;
};

export const signOut = async () => {
  const response = await REQUEST.post(`${USERS_API}/signout`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await REQUEST.get(`${USERS_API}`);
  return response.data;
};

export const updateUserByUserId = async (userId, updatedFields) => {
  const response = await REQUEST.put(`${USERS_API}/${userId}`, updatedFields);
  if (userId === getCurrentUser()._id) {
    storeCurrentUser({ ...getCurrentUser(), ...updatedFields });
  }
  return response.data;
};

export const getUserByUsername = async (username) => {
  const response = await REQUEST.get(`${USERS_API}/${username}`);
  return response.data;
};

export const purchaseUpgradeForUser = async (userId, upgrade) => {
  const response = await REQUEST.post(`${USERS_API}/${userId}/upgrade`, {
    upgrade,
  });
  return response.data;
};

// CATS API FUNCTIONS
export const getCatsByUserId = async (userId) => {
  const response = await REQUEST.get(`${CATS_API}/ownerships/${userId}`);
  return response.data;
};

export const getFavoritedCatsByUserId = async (userId) => {
  const response = await REQUEST.get(`${CATS_API}/favorites/${userId}`);
  return response.data;
};

export const addUserFavorites = async (userId, breed) => {
  const response = await REQUEST.post(`${CATS_API}/favorites/${userId}`, {
    breed,
  });
  return response.data;
};

export const removeUserFavorites = async (userId, breed) => {
  const response = await REQUEST.delete(
    `${CATS_API}/favorites/${userId}/${breed}`,
  );
  return response.data;
};

export const rollCatForUser = async (userId) => {
  const response = await REQUEST.get(`${CATS_API}/roll/${userId}`);
  return response.data;
};

// GAME INFO API FUNCTIONS
export const getMultipliers = async () => {
  const response = await REQUEST.get(`${BASE_API_URL}/info/multipliers`);
  return response.data;
};

export const getOdds = async () => {
  const response = await REQUEST.get(`${BASE_API_URL}/info/odds`);
  return response.data;
};

const catGifs = importAll(require.context("./assets/gifs", false, /\.(gif)$/));

const getRandomCatGif = () => {
  const keys = Object.keys(catGifs);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return catGifs[randomKey];
};

const getRarities = async () => {
  const response = await REQUEST.get(`${CATS_API}/rarities`);
  return response.data;
}

export const catGif = getRandomCatGif();
if (getCurrentUser()) {
  const updatedUser = await getUserDataByUserId(getCurrentUser()._id);
  storeCurrentUser({ ...getCurrentUser(), ...updatedUser });
}
export const ALL_CAT_RARITIES = await getRarities();
export const MULTIPLIERS = await getMultipliers();
export const ODDS = await getOdds();
