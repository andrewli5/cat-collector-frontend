import axios from "axios";
import { LOCAL_API_URL } from "./constants";
import { importAll } from "./utils/utils";

export const BASE_API_URL = import.meta.env.VITE_APP_API_URL || LOCAL_API_URL;
export const USERS_API = `${BASE_API_URL}/users`;
export const CATS_API = `${BASE_API_URL}/cats`;

const DEFAULT_MULTIPLIERS = {
  C: 1.08,
  U: 1.12,
  R: 1.2,
  E: 1.3,
  L: 1.6,
  M: 2,
};

const BASE_ODDS = {
  C: 0.8,
  U: 0.15,
  R: 0.04,
  E: 0.009,
  L: 0.001,
  M: 0.0,
};

const LUCK1_ODDS = {
  C: 0.6,
  U: 0.25,
  R: 0.1,
  E: 0.045,
  L: 0.005,
  M: 0.0,
};

const LUCK2_ODDS = {
  C: 0.4,
  U: 0.3,
  R: 0.15,
  E: 0.1,
  L: 0.01,
  M: 0.0,
};

const LUCK3_ODDS = {
  C: 0.2,
  U: 0.4,
  R: 0.2,
  E: 0.15,
  L: 0.05,
  M: 0.01,
};

const DEFAULT_ODDS = {
  BASE: BASE_ODDS,
  LUCK1: LUCK1_ODDS,
  LUCK2: LUCK2_ODDS,
  LUCK3: LUCK3_ODDS,
};

const DEFAULT_RARITIES = [
  { _id: "65712f330c9830055d8384b8", breed: "cspa", rarity: "L" },
  { _id: "65712f330c9830055d8384d1", breed: "java", rarity: "R" },
  { _id: "65712f330c9830055d8384d6", breed: "abob", rarity: "U" },
  { _id: "65712f330c9830055d8384e8", breed: "birm", rarity: "C" },
  { _id: "65712f330c9830055d8384ef", breed: "aege", rarity: "C" },
  { _id: "65712f330c9830055d8384c6", breed: "tonk", rarity: "E" },
  { _id: "65712f330c9830055d8384b9", breed: "crex", rarity: "E" },
  { _id: "65712f330c9830055d8384c8", breed: "tang", rarity: "E" },
  { _id: "65712f330c9830055d8384cb", breed: "bslo", rarity: "R" },
  { _id: "65712f330c9830055d8384d7", breed: "amis", rarity: "U" },
  { _id: "65712f330c9830055d8384da", breed: "kora", rarity: "U" },
  { _id: "65712f330c9830055d8384db", breed: "mcoo", rarity: "U" },
  { _id: "65712f330c9830055d8384e5", breed: "buri", rarity: "C" },
  { _id: "65712f330c9830055d8384ec", breed: "ragd", rarity: "C" },
  { _id: "65712f330c9830055d8384f2", breed: "bsho", rarity: "C" },
  { _id: "65712f330c9830055d8384f3", breed: "hima", rarity: "C" },
  { _id: "65712f330c9830055d8384be", breed: "manx", rarity: "E" },
  { _id: "65712f330c9830055d8384c2", breed: "siam", rarity: "E" },
  { _id: "65712f330c9830055d8384c4", breed: "sing", rarity: "E" },
  { _id: "65712f330c9830055d8384d8", breed: "bomb", rarity: "U" },
  { _id: "65712f330c9830055d8384dd", breed: "nebe", rarity: "U" },
  { _id: "65712f330c9830055d8384e6", breed: "char", rarity: "C" },
  { _id: "65712f330c9830055d8384e7", breed: "acur", rarity: "C" },
  { _id: "65712f330c9830055d8384ee", breed: "srex", rarity: "C" },
  { _id: "65712f330c9830055d8384f6", breed: "rblu", rarity: "C" },
  { _id: "65712f330c9830055d8384b4", breed: "abys", rarity: "L" },
  { _id: "65712f330c9830055d8384b6", breed: "bamb", rarity: "E" },
  { _id: "65712f330c9830055d8384b5", breed: "bali", rarity: "E" },
  { _id: "65712f330c9830055d8384b7", breed: "beng", rarity: "E" },
  { _id: "65712f330c9830055d8384bf", breed: "ocic", rarity: "E" },
  { _id: "65712f330c9830055d8384cc", breed: "bure", rarity: "R" },
  { _id: "65712f330c9830055d8384d2", breed: "lape", rarity: "U" },
  { _id: "65712f330c9830055d8384ea", breed: "emau", rarity: "C" },
  { _id: "65712f330c9830055d8384eb", breed: "esho", rarity: "C" },
  { _id: "65712f330c9830055d8384c1", breed: "sava", rarity: "L" },
  { _id: "65712f330c9830055d8384c7", breed: "toyg", rarity: "R" },
  { _id: "65712f330c9830055d8384c9", breed: "tvan", rarity: "R" },
  { _id: "65712f330c9830055d8384ed", breed: "sfol", rarity: "C" },
  { _id: "65712f330c9830055d8384f1", breed: "khao", rarity: "C" },
  { _id: "65712f330c9830055d8384f5", breed: "lihu", rarity: "C" },
  { _id: "65712f330c9830055d8384ba", breed: "cymr", rarity: "E" },
  { _id: "65712f330c9830055d8384bd", breed: "kuri", rarity: "E" },
  { _id: "65712f330c9830055d8384c5", breed: "soma", rarity: "E" },
  { _id: "65712f330c9830055d8384ca", breed: "ycho", rarity: "E" },
  { _id: "65712f330c9830055d8384d3", breed: "munc", rarity: "R" },
  { _id: "65712f330c9830055d8384d4", breed: "pixi", rarity: "R" },
  { _id: "65712f330c9830055d8384d5", breed: "snow", rarity: "U" },
  { _id: "65712f330c9830055d8384de", breed: "raga", rarity: "U" },
  { _id: "65712f330c9830055d8384e3", breed: "asho", rarity: "C" },
  { _id: "65712f330c9830055d8384bb", breed: "drex", rarity: "L" },
  { _id: "65712f330c9830055d8384bc", breed: "jbob", rarity: "E" },
  { _id: "65712f330c9830055d8384c3", breed: "sibe", rarity: "E" },
  { _id: "65712f330c9830055d8384cd", breed: "ctif", rarity: "R" },
  { _id: "65712f330c9830055d8384cf", breed: "chee", rarity: "R" },
  { _id: "65712f330c9830055d8384df", breed: "sphy", rarity: "U" },
  { _id: "65712f330c9830055d8384e1", breed: "cypr", rarity: "U" },
  { _id: "65712f330c9830055d8384f0", breed: "dons", rarity: "C" },
  { _id: "65712f330c9830055d8384c0", breed: "orie", rarity: "E" },
  { _id: "65712f330c9830055d8384ce", breed: "chau", rarity: "R" },
  { _id: "65712f330c9830055d8384d0", breed: "ebur", rarity: "R" },
  { _id: "65712f330c9830055d8384d9", breed: "hbro", rarity: "U" },
  { _id: "65712f330c9830055d8384e0", breed: "amau", rarity: "U" },
  { _id: "65712f330c9830055d8384e2", breed: "norw", rarity: "C" },
  { _id: "65712f330c9830055d8384e4", breed: "awir", rarity: "C" },
  { _id: "65712f330c9830055d8384e9", breed: "csho", rarity: "C" },
  { _id: "65712f330c9830055d8384f4", breed: "pers", rarity: "C" },
  { _id: "6576c7ddb34abbbf6149cbff", breed: "rory", rarity: "M" },
  { _id: "6576c7f2b34abbbf6149cc00", breed: "mimi", rarity: "M" },
];

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
  completionHandler
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
    `${CATS_API}/favorites/${userId}/${breed}`
  );
  return response.data;
};

export const rollCatForUser = async (userId) => {
  const response = await REQUEST.get(`${CATS_API}/roll/${userId}`);
  return response.data;
};

const catGifs = importAll(
  import.meta.globEager("./assets/gifs/*.gif")
);

const getRandomCatGif = () => {
  const keys = Object.keys(catGifs);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return catGifs[randomKey];
};

export const catGif = getRandomCatGif();
if (getCurrentUser()) {
  const updatedUser = await getUserDataByUserId(getCurrentUser()._id);
  storeCurrentUser({ ...getCurrentUser(), ...updatedUser });
}

// GAME INFO API FUNCTIONS
const DEFAULT_TIMEOUT = 2000;
export const getMultipliers = async () => {
  try {
    const response = await Promise.race([
      REQUEST.get(`${BASE_API_URL}/info/multipliers`),
      new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Request for multipliers timed out")),
          DEFAULT_TIMEOUT
        );
      }),
    ]);
    return response.data;
  } catch (error) {
    console.log(error);
    return DEFAULT_MULTIPLIERS;
  }
};

export const getOdds = async () => {
  try {
    const response = await Promise.race([
      REQUEST.get(`${BASE_API_URL}/info/odds`),
      new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Request for odds timed out")),
          DEFAULT_TIMEOUT
        );
      }),
    ]);
    return response.data;
  } catch (error) {
    console.log(error);
    return DEFAULT_ODDS;
  }
};

const getRarities = async () => {
  try {
    const response = await await Promise.race([
      REQUEST.get(`${CATS_API}/rarities`),
      new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Request for rarities timed out")),
          DEFAULT_TIMEOUT
        );
      }),
    ]);
    return response.data;
  } catch (error) {
    console.log(error);
    return DEFAULT_RARITIES;
  }
};

export const ALL_CAT_RARITIES = DEFAULT_RARITIES;
export const MULTIPLIERS = DEFAULT_MULTIPLIERS;
export const ODDS = DEFAULT_ODDS;
