import { useEffect, useState } from "react";
import { Typography, Link, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import "../css/styles.css";
import {
  APP_NAME,
  CATICON_TO_BREEDID,
  RARITY_TO_VALUE,
  RARITY_TO_STRING,
} from "../constants";
import { getCurrentUser } from "../client";
import { useNavigate, useParams } from "react-router-dom";
import { importAll } from "../utils/importAll";
import { ALL_CAT_RARITIES } from "../client";
import { MyCatsSort } from "./MyCatsSort";
import UnknownCat from "../assets/unknown_cat.png";
import Heart from "../assets/heart_icon.png";
import CatchingHeart from "../assets//gifs/cat_catching_heart.gif";

export default function MyCats({ favorites = false, rarity = false }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmptyFavorites, setIsEmptyFavorites] = useState(false);
  const [title, setTitle] = useState("");
  const [showUnowned, setShowUnowned] = useState(false);
  const [allCatIcons, setAllCatIcons] = useState([]);
  const [mythicCatIcons, setMythicCatIcons] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  var cats = [];
  if (getCurrentUser()) {
    cats = getCurrentUser().cats;
  }

  function getIconsToDisplay() {
    var icons = Object.keys(allCatIcons);
    if (favorites && getCurrentUser()) {
      const userFavorites = getCurrentUser().favorites;
      icons = icons.filter((catIcon) => {
        const currentBreed = CATICON_TO_BREEDID[catIcon];
        return userFavorites.includes(currentBreed);
      });
    } else if (rarity) {
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
    var [name, src, imageStyle, textColor] = [
      "",
      "",
      {
        WebkitFilter: "grayscale(100%)",
        opacity: 0.2,
        mask: "linear-gradient(-60deg, transparent, #000, transparent)",
      },
      "grey",
    ];
    if (rarity === "M") {
      src = getIconSrcForMythicCat(catIcon, currentBreedId);
      name = getIconNameForMythicCat(catIcon, currentBreedId);
    } else {
      name = catIcon.replace(".png", "").replace("_", " ").replace(" cat", "");
      src = allCatIcons[catIcon];
    }
    if (cats.includes(currentBreedId)) {
      imageStyle.opacity = 1;
      imageStyle.WebkitFilter = "grayscale(0%)";
      textColor = "white";
    }
    return [name, src, imageStyle, textColor];
  };

  const getHref = (rarity, catIcon) => {
    const currentBreedId = CATICON_TO_BREEDID[catIcon];
    return rarity === "M" && !cats.includes(currentBreedId)
      ? "/details/???"
      : `/details/${CATICON_TO_BREEDID[catIcon]}`;
  };

  const skipDisplay = (currentBreedId) => {
    // Don't display the cat if the breed is undefined, or if we aren't showing unowned cats
    return (
      (!showUnowned && !cats.includes(currentBreedId)) ||
      currentBreedId === undefined
    );
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
    if (getCurrentUser() && favorites) {
      setIsEmptyFavorites(getCurrentUser().favorites.length === 0);
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
          color={"white"}
          textAlign="center"
          sx={{ width: "100vw", overflowX: "hidden" }}
        >
          {title}
        </Typography>
      </Box>

      {favorites && getCurrentUser() && isEmptyFavorites ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "100vw",
            padding: "20px",
          }}
        >
          <img
            src={CatchingHeart}
            width={175}
            height={175}
            style={{ paddingBottom: "10px" }}
          />
          <Typography variant="h5">
            you have no favorites yet. click the{" "}
            {<img src={Heart} width={15} height={15} />} icon on a cat's profile
            to favorite it!
          </Typography>
        </Box>
      ) : (
        <>
          <Typography
            variant="h4"
            color="white"
            textAlign="center"
            sx={{ paddingRight: "20px", paddingTop: "10px" }}
          >
            <MyCatsSort
              sortFunction={sortFunction}
              reverseFunction={reverseFunction}
              showUnowned={showUnowned}
              setShowUnowned={setShowUnowned}
            />
          </Typography>
          <Box display="flex" justifyContent="center">
            <Grid
              container
              sx={{
                marginTop: 3,
              }}
              maxWidth="1100px"
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {getIconsToDisplay().map((catIcon, index) => {
                const currentBreedId = CATICON_TO_BREEDID[catIcon];
                if (skipDisplay(currentBreedId)) {
                  return null;
                }
                const rarity = ALL_CAT_RARITIES.find(
                  (b) => b.breed === currentBreedId
                )["rarity"];
                const [name, src, imageStyle, textColor] = getIconData(
                  catIcon,
                  currentBreedId,
                  rarity
                );
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
                      href={getHref(rarity, catIcon)}
                    >
                      <img
                        style={{
                          ...imageStyle,
                          borderRadius: "10px",
                        }}
                        src={src}
                        width={120}
                        height={120}
                        alt={catIcon}
                      />
                      <Typography
                        variant="h5"
                        color={textColor}
                        textAlign="center"
                      >
                        {name}
                      </Typography>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
