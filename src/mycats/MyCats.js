import { useEffect, useState } from "react";
import { Typography, Link } from "@mui/material";
import Grid from "@mui/material/Grid";
import "../css/styles.css";
import {
  APP_NAME,
  CATICON_TO_BREEDID,
  RARITY_TO_COLOR,
  RARITY_TO_VALUE,
  RARITY_TO_STRING,
} from "../constants";
import { getCurrentUser } from "../client";
import { useNavigate, useParams } from "react-router-dom";
import { importAll } from "../utils/importAll";
import { ALL_CAT_RARITIES } from "../client";
import { MyCatsSort } from "./MyCatsSort";

export default function MyCats({ favorites = false, rarity = false }) {
  const navigate = useNavigate();
  const params = useParams();
  const [catIcons, setCatIcons] = useState([]);

  var cats = [];
  if (getCurrentUser()) {
    cats = getCurrentUser().cats;
  }

  useEffect(() => {
    document.title =
      (favorites ? "favorites" : rarity ? "rarities" : "my cats") +
      " | " +
      APP_NAME;
    if (!getCurrentUser()) {
      navigate("/signin");
    }
  }, []);

  if (!getCurrentUser()) {
    return null;
  }

  function catIconToBreedId(catIcon) {
    return CATICON_TO_BREEDID[catIcon];
  }

  function getIconsToDisplay() {
    var icons = [];
    if (favorites && getCurrentUser()) {
      icons = Object.keys(catIcons).filter((catIcon) => {
        const currentBreed = catIconToBreedId(catIcon);
        const userFavorites = getCurrentUser().favorites;
        return userFavorites.includes(currentBreed);
      });
    } else if (rarity && getCurrentUser()) {
      // display icons of the current rarity
      icons = Object.keys(catIcons).filter((catIcon) => {
        const currentBreed = catIconToBreedId(catIcon);
        const all_rarities = ALL_CAT_RARITIES;
        console.log(all_rarities);
        const currentRarity = all_rarities["data"].find(
          (b) => b.breed === currentBreed
        )["rarity"];
        return currentRarity === params.rarity;
      });
    } else {
      // display all icons on mycats page
      icons = Object.keys(catIcons);
    }
    return icons;
  }

  const resetFunction = () => {
    const icons = importAll(
      require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
    );
    setCatIcons(icons);
  };

  const reverseFunction = () => {
    const reversedIcons = {};
    Object.keys(catIcons)
      .reverse()
      .forEach((icon) => {
        reversedIcons[icon] = catIcons[icon];
      });
    setCatIcons(reversedIcons);
  };

  const sortFunction = (term) => {
    // sort CatIcons by name, rarity, or ownership
    if (term === "name") {
      const sortedIcons = Object.keys(catIcons).sort();
      const sortedIconsObj = {};
      sortedIcons.forEach((icon) => {
        sortedIconsObj[icon] = catIcons[icon];
      });
      setCatIcons(sortedIconsObj);
    } else if (term === "rarity") {
      const sortedIcons = Object.keys(catIcons).sort((b1, b2) => {
        const b1Rarity = ALL_CAT_RARITIES["data"].find(
          (b) => b.breed === CATICON_TO_BREEDID[b1]
        )["rarity"];
        const b2Rarity = ALL_CAT_RARITIES["data"].find(
          (b) => b.breed === CATICON_TO_BREEDID[b2]
        )["rarity"];
        return RARITY_TO_VALUE[b1Rarity] - RARITY_TO_VALUE[b2Rarity];
      });
      const sortedIconsObj = {};
      sortedIcons.forEach((icon) => {
        sortedIconsObj[icon] = catIcons[icon];
      });
      setCatIcons(sortedIconsObj);
    } else if (term === "owned") {
      const sortedIcons = Object.keys(catIcons).sort((a, b) => {
        const aOwned = cats.includes(CATICON_TO_BREEDID[a]);
        const bOwned = cats.includes(CATICON_TO_BREEDID[b]);
        return aOwned - bOwned;
      });
      const sortedIconsObj = {};
      sortedIcons.forEach((icon) => {
        sortedIconsObj[icon] = catIcons[icon];
      });
      setCatIcons(sortedIconsObj);
    }
  };

  useEffect(() => {
    document.title = (favorites ? "favorites" : "my cats | ") + APP_NAME;
    if (!getCurrentUser()) {
      navigate("/signin");
    }

    resetFunction();
  }, []);

  return (
    <>
      <Typography variant="h3" color="white" textAlign="center">
        {favorites
          ? "my favorites"
          : rarity
            ? RARITY_TO_STRING[params.rarity].toLowerCase() + " cats"
            : "my cats (" +
              cats.length +
              "/" +
              Object.keys(catIcons).length +
              ")"}
      </Typography>
      <Typography variant="h4" color="white" textAlign="center">
        <MyCatsSort
          sortFunction={sortFunction}
          reverseFunction={reverseFunction}
        />
      </Typography>
      <Grid container spacing={0.5} sx={{ marginTop: 3 }}>
        {getIconsToDisplay().map((catIcon, index) => {
          const rarity = ALL_CAT_RARITIES["data"].find(
            (b) => b.breed === CATICON_TO_BREEDID[catIcon]
          )["rarity"];
          const name = catIcon.replace(".png", "").replace("_", " ");
          var textColor = "grey";
          var imageStyle = {
            WebkitFilter: "grayscale(100%)",
            border: "1px solid gray",
          };
          if (cats.includes(CATICON_TO_BREEDID[catIcon])) {
            imageStyle = { border: `1px solid ${RARITY_TO_COLOR[rarity]}` };
            textColor = "white";
          }
          return (
            <Grid
              display="flex"
              flexDirection="column"
              alignItems="center"
              item
              xs={2}
              key={index}
              sx={{ marginBottom: 3 }}
              className="hover"
            >
              <Link
                textAlign="center"
                underline="none"
                color="inherit"
                href={`/details/${catIconToBreedId(catIcon)}`}
              >
                <img
                  style={{
                    ...imageStyle,
                    borderRadius: "5px",
                  }}
                  src={catIcons[catIcon]}
                  width={60}
                  height={60}
                  alt={catIcon}
                />
                <Typography variant="h5" color={textColor} textAlign="center">
                  {name}
                </Typography>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
