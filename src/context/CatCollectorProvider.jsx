import React, { createContext, useEffect, useState } from "react";
import * as meows from "../assets/meows";
import { importAll } from "../utils/utils";

export const CatCollectorContext = createContext();

export const CatCollectorProvider = ({ children }) => {
  const [catIcons, setCatIcons] = useState([]);
  const [mythicCatIcons, setMythicCatIcons] = useState([]);
  const [catGifs, setCatGifs] = useState([]);
  const [profileIcons, setProfileIcons] = useState([]);

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

    getCatIcons();
    getMythicCatIcons();
    getCatGifs();
    getProfileIcons();
  }, []);

  return (
    <CatCollectorContext.Provider
      value={{
        catIcons,
        mythicCatIcons,
        profileIcons,
        catGifs,
        getRandomCatGif,
        getRandomMeowSound,
      }}
    >
      {children}
    </CatCollectorContext.Provider>
  );
};
