import React, { createContext, useEffect, useState } from "react";
import * as meows from "../assets/meows";
import { importAll } from "../utils/utils";
import { getMultipliers, getOdds, getRarities } from "../client";
import {
  FALLBACK_MULTIPLIERS,
  FALLBACK_ODDS,
  FALLBACK_RARITIES,
} from "../constants";

export const CatCollectorContext = createContext();

export const CatCollectorProvider = ({ children }) => {
  const [catIcons, setCatIcons] = useState([]);
  const [mythicCatIcons, setMythicCatIcons] = useState([]);
  const [catGifs, setCatGifs] = useState([]);
  const [profileIcons, setProfileIcons] = useState([]);
  const [gameInfo, setGameInfo] = useState({
    rarities: FALLBACK_RARITIES,
    multipliers: FALLBACK_MULTIPLIERS,
    odds: FALLBACK_ODDS,
  });

  const getRandomCatGif = () => {
    const keys = Object.keys(catGifs);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return catGifs[randomKey];
  };

  const meowFiles = [
    meows.meow,
    meows.meow1,
    meows.meow2,
    meows.meow3,
    meows.meow4,
    meows.meow5,
    meows.meow6,
    meows.meow7,
  ];

  const getRandomMeowSound = () => {
    const idx = Math.floor(Math.random() * meowFiles.length);
    return new Audio(meowFiles[idx]);
  };

  useEffect(() => {
    const getCatIcons = async () => {
      const icons = await importAll(
        import.meta.glob("../assets/catIcons/*.png"),
      );
      setCatIcons(icons);
    };

    const getMythicCatIcons = async () => {
      const icons = await importAll(
        import.meta.glob("../assets/mythicCatIcons/*.jpg"),
      );
      setMythicCatIcons(icons);
    };

    const getCatGifs = async () => {
      const catGifs = await importAll(import.meta.glob("../assets/gifs/*.gif"));
      setCatGifs(catGifs);
    };

    const getProfileIcons = async () => {
      const profileIcons = await importAll(
        import.meta.glob("../assets/profileIcons/*.png"),
      );
      setProfileIcons(profileIcons);
    };

    const getGameInfo = async () => {
      const rarities = await getRarities();
      const multipliers = await getMultipliers();
      const odds = await getOdds();

      setGameInfo({ rarities, multipliers, odds });
    };

    getCatIcons();
    getMythicCatIcons();
    getCatGifs();
    getProfileIcons();
    getGameInfo();
  }, []);

  return (
    <CatCollectorContext.Provider
      value={{
        catIcons,
        mythicCatIcons,
        profileIcons,
        catGifs,
        gameInfo,
        getRandomCatGif,
        getRandomMeowSound,
      }}
    >
      {children}
    </CatCollectorContext.Provider>
  );
};
