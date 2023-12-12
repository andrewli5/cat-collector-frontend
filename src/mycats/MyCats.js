import { useEffect, useState } from "react";
import { Typography, Link, Box } from "@mui/material";
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
  const [allCatIcons, setAllCatIcons] = useState([]); // [catIcons, mythicCatIcons]
  const [catIcons, setCatIcons] = useState([]);
  const [mythicCatIcons, setMythicCatIcons] = useState([]);

  var cats = [];
  if (getCurrentUser()) {
    cats = getCurrentUser().cats;
  }

  function getIconsToDisplay() {
    var icons = Object.keys(allCatIcons);
    if (favorites && getCurrentUser()) {
      icons = icons.filter((catIcon) => {
        const currentBreed = CATICON_TO_BREEDID[catIcon];
        const userFavorites = getCurrentUser().favorites;
        return userFavorites.includes(currentBreed);
      });
    } else if (rarity) {
      // display icons of the current rarity
      icons = icons.filter((catIcon) => {
        const currentBreed = CATICON_TO_BREEDID[catIcon];
        if (currentBreed === undefined) {
          return false;
        } else {
          const currentRarity = ALL_CAT_RARITIES.find(
            (b) => b.breed === currentBreed
          )["rarity"];
          return currentRarity === params.rarity;
        }
      });
    }
    return icons;
  }

  const getIconSrcForMythicCat = (catIcon, currentBreedId) => {
    return !cats.includes(currentBreedId) || !getCurrentUser()
      ? UnknownCat
      : mythicCatIcons[catIcon];
  };

  const getIconNameForMythicCat = (catIcon, currentBreedId) => {
    return !cats.includes(currentBreedId) || !getCurrentUser()
      ? "?????"
      : catIcon.replace(".jpg", "").replace("_", " ");
  };

  const getIconData = (catIcon, currentBreedId, rarity) => {
    var [name, src] = ["", ""];
    if (rarity === "M") {
      src = getIconSrcForMythicCat(catIcon, currentBreedId);
      name = getIconNameForMythicCat(catIcon, currentBreedId);
    } else {
      name = catIcon.replace(".png", "").replace("_", " ").replace(" cat", "");
      src = allCatIcons[catIcon];
    }
    return [name, src];
  };

  const resetFunction = () => {
    const icons = importAll(
      require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
    );
    const mythicIcons = importAll(
      require.context("../assets/mythicCatIcons", false, /\.(png|jpe?g|svg)$/)
    );
    const allIcons = Object.assign({}, icons, mythicIcons);
    setAllCatIcons(allIcons);
    setMythicCatIcons(mythicIcons);
  };

  const reverseFunction = () => {
    const reversedIcons = {};
    Object.keys(allCatIcons)
      .reverse()
      .forEach((icon) => {
        reversedIcons[icon] = allCatIcons[icon];
      });
    setAllCatIcons(reversedIcons);
  };

  const sortFunction = (term) => {
    // sort all cat icon png/jpg files
    var sortedIcons = Object.keys(allCatIcons).sort();
    var sortedIconsObj = {};
    if (term === "name") {
      // A-Z sorting but put unowned mythic cats at the end
      sortedIcons.sort((b1, b2) => {
        const breed1 = CATICON_TO_BREEDID[b1];
        const breed2 = CATICON_TO_BREEDID[b2];
        if (breed1 === undefined || breed2 === undefined) {
          return breed1 === undefined ? -1 : 1;
        }
        const b1Rarity = ALL_CAT_RARITIES.find((b) => b.breed === breed1)[
          "rarity"
        ];
        const b2Rarity = ALL_CAT_RARITIES.find((b) => b.breed === breed2)[
          "rarity"
        ];
        if (b1Rarity === "M" || b2Rarity === "M") {
          return b1Rarity === "M" && !cats.includes(CATICON_TO_BREEDID[breed1])
            ? 1
            : b2Rarity === "M" && !cats.includes(CATICON_TO_BREEDID[breed2])
              ? -1
              : 0;
        }
      });
    } else if (term === "rarity") {
      sortedIcons.sort((b1, b2) => {
        const breed1 = CATICON_TO_BREEDID[b1];
        const breed2 = CATICON_TO_BREEDID[b2];
        if (breed1 === undefined || breed2 === undefined) {
          return breed1 === undefined ? -1 : 1;
        }
        const b1Rarity = ALL_CAT_RARITIES.find((b) => b.breed === breed1)[
          "rarity"
        ];
        const b2Rarity = ALL_CAT_RARITIES.find((b) => b.breed === breed2)[
          "rarity"
        ];
        return RARITY_TO_VALUE[b1Rarity] - RARITY_TO_VALUE[b2Rarity];
      });
    } else if (term === "owned") {
      sortedIcons = Object.keys(allCatIcons);
      sortedIcons.sort((a, b) => {
        const aOwned = cats.includes(CATICON_TO_BREEDID[a]);
        const bOwned = cats.includes(CATICON_TO_BREEDID[b]);
        return aOwned - bOwned;
      });
    }
    sortedIcons.forEach((icon) => {
      sortedIconsObj[icon] = allCatIcons[icon];
    });
    setAllCatIcons(sortedIconsObj);
  };

  useEffect(() => {
    document.title =
      (favorites ? "favorites | " : rarity ? "rarities | " : "my cats | ") +
      APP_NAME;
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
              (Object.keys(allCatIcons).length - 1) +
              ")"
          );
        }
      }
    };

    renderTitle();
  }, [isLoading]);

  return (
    <>
      <Box bgcolor="primary.main" sx={{ marginBottom: "10px" }}>
        <Typography
          variant="h3"
          color="white"
          textAlign="center"
          sx={{ width: "100vw", overflowX: "hidden" }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        variant="h4"
        color="white"
        textAlign="center"
        sx={{ paddingRight: "20px", paddingTop: "10px" }}
      >
        <MyCatsSort
          sortFunction={sortFunction}
          reverseFunction={reverseFunction}
        />
      </Typography>
      <Grid container spacing={0.5} sx={{ marginTop: 3 }}>
        {getIconsToDisplay().map((catIcon, index) => {
          const currentBreedId = CATICON_TO_BREEDID[catIcon];
          if (currentBreedId === undefined) {
            return null;
          }
          const rarity = ALL_CAT_RARITIES.find(
            (b) => b.breed === currentBreedId
          )["rarity"];
          const [name, src] = getIconData(catIcon, currentBreedId, rarity);
          var textColor = "grey";
          var imageStyle = {
            WebkitFilter: "grayscale(100%)",
            border: "1px solid gray",
          };
          if (cats.includes(currentBreedId)) {
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
                href={
                  rarity === "M" && !cats.includes(currentBreedId)
                    ? "/details/???"
                    : `/details/${CATICON_TO_BREEDID[catIcon]}`
                }
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
