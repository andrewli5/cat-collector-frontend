import React, { useEffect } from "react";
import { Typography, Link } from "@mui/material";
import Grid from "@mui/material/Grid";
import "../css/styles.css";
import { APP_NAME, CATICON_TO_BREEDID, RARITY_TO_COLOR } from "../constants";
import { getCurrentUser } from "../client";
import { useNavigate } from "react-router-dom";
import { importAll } from "../utils/importAll";
import { ALL_CAT_RARITIES } from "../client";

export default function MyCats({ favorites = false }) {
  const navigate = useNavigate();
  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );
  var cats = [];
  if (getCurrentUser()) {
    cats = getCurrentUser().cats;
  }

  useEffect(() => {
    document.title = (favorites ? "favorites" : "my cats | ") + APP_NAME;
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
    } else {
      icons = Object.keys(catIcons);
    }
    return icons;
  }

  return (
    <>
      <Typography variant="h3" color="white" textAlign="center">
        {favorites
          ? "my favorites"
          : "my cats (" +
            cats.length +
            "/" +
            Object.keys(catIcons).length +
            ")"}
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
