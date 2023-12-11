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
import UnknownCat from "../assets/unknown_cat.png";

export default function MyCats({ favorites = false, rarity = false }) {
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const [catIcons, setCatIcons] = useState([]);
  const [mythicCatIcons, setMythicCatIcons] = useState([]);

  var cats = [];
  if (getCurrentUser()) {
    cats = getCurrentUser().cats;
  }

  function catIconToBreedId(catIcon) {
    return CATICON_TO_BREEDID[catIcon];
  }

  function getIconsToDisplay() {
    var icons = Object.keys(catIcons).concat(Object.keys(mythicCatIcons));
    if (favorites && getCurrentUser()) {
      icons = icons.filter((catIcon) => {
        const currentBreed = catIconToBreedId(catIcon);
        const userFavorites = getCurrentUser().favorites;
        return userFavorites.includes(currentBreed);
      });
    } else if (rarity) {
      // display icons of the current rarity
      icons = icons.filter((catIcon) => {
        const currentBreed = catIconToBreedId(catIcon);
        if (currentBreed === undefined) {
          return false;
        } else {
          const all_rarities = ALL_CAT_RARITIES;
          const currentRarity = all_rarities["data"].find(
            (b) => b.breed === currentBreed
          )["rarity"];
          return currentRarity === params.rarity;
        }
      });
    }
    return icons;
  }

  const resetFunction = () => {
    const icons = importAll(
      require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
    );
    const mythicIcons = importAll(
      require.context("../assets/mythicCatIcons", false, /\.(png|jpe?g|svg)$/)
    );
    setCatIcons(icons);
    setMythicCatIcons(mythicIcons);
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
      const rarities = ALL_CAT_RARITIES["data"];
      const sortedIcons = Object.keys(catIcons).sort((b1, b2) => {
        const breed1 = CATICON_TO_BREEDID[b1];
        const breed2 = CATICON_TO_BREEDID[b2];
        if (breed1 === undefined || breed2 === undefined) {
          return 0;
        }
        const b1Rarity = rarities.find((b) => b.breed === breed1)["rarity"];
        const b2Rarity = rarities.find((b) => b.breed === breed2)["rarity"];
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
    document.title =
      (favorites ? "favorites" : rarity ? "rarities" : "my cats | ") + APP_NAME;
    if (!getCurrentUser() && favorites) {
      navigate("/signin");
    }

    resetFunction();
  }, []);

  useEffect(() => {
    const renderTitle = () => {
      if (favorites) {
        setTitle("favorites");
      } else if (rarity) {
        setTitle(RARITY_TO_STRING[params.rarity].toLowerCase() + " cats");
      } else {
        if (isLoading) {
          setTitle("loading my cats...");
          setIsLoading(false);
        } else {
          setTitle(
            "my cats " +
              "(" +
              cats.length +
              "/" +
              (Object.keys(catIcons).length - 1) +
              ")"
          );
        }
      }
    };

    renderTitle();
  }, [isLoading]);

  return (
    <>
      <Typography> {}</Typography>
      <Typography variant="h3" color="white" textAlign="center">
        {title}
      </Typography>
      <Typography variant="h4" color="white" textAlign="center">
        <MyCatsSort
          sortFunction={sortFunction}
          reverseFunction={reverseFunction}
        />
      </Typography>
      <Grid container spacing={0.5} sx={{ marginTop: 3 }}>
        {getIconsToDisplay().map((catIcon, index) => {
          const currentBreedId = CATICON_TO_BREEDID[catIcon];
          if (currentBreedId === undefined) {
            // no match was found
            console.log("no match was found for " + catIcon);
            return null;
          }
          const rarities = ALL_CAT_RARITIES["data"];
          const rarity = rarities.find((b) => b.breed === currentBreedId)[
            "rarity"
          ];
          var name = "?????";
          var src = "";
          var textColor = "grey";
          var imageStyle = {
            WebkitFilter: "grayscale(100%)",
            border: "1px solid gray",
          };
          if (cats.includes(currentBreedId)) {
            imageStyle = { border: `1px solid ${RARITY_TO_COLOR[rarity]}` };
            textColor = "white";
          }
          if (rarity === "M") {
            // a mythic cat's icon has "?" display, and its name isn't shown
            // catIcon can be unknown vs shown
            // src is unknowncat if the user doesn't own the cat, but if
            // they do then its just the regular png, stored in assets
            src =
              !cats.includes(currentBreedId) || !getCurrentUser()
                ? UnknownCat
                : mythicCatIcons[catIcon];
          } else {
            name = catIcon
              .replace(".png", "")
              .replace("_", " ")
              .replace(" cat", "");
            src = catIcons[catIcon];
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
                  src={src}
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
