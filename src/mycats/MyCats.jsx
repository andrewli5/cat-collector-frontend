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
import {
  getCurrentUser,
  getUserByUsername,
  getUserDataByUserId,
} from "../client";
import { useNavigate, useParams } from "react-router-dom";
import { importAll } from "../utils/utils";
import { ALL_CAT_RARITIES } from "../client";
import { MyCatsSort } from "./MyCatsSort";
import UnknownCat from "../assets/unknown_cat.png";
import Heart from "../assets/heart_icon.png";
import CatchingHeart from "../assets//gifs/cat_catching_heart.gif";

export default function MyCats({
  favorites = false,
  rarity = false,
  view = false,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmptyFavorites, setIsEmptyFavorites] = useState(false);
  const [title, setTitle] = useState("");
  const [showUnowned, setShowUnowned] = useState(false);
  const [allCatIcons, setAllCatIcons] = useState([]);
  const [mythicCatIcons, setMythicCatIcons] = useState([]);
  const [cats, setCats] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

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
    var c = cats;
    if (view && getCurrentUser()) {
      c = getCurrentUser().cats;
    }
    return !c.includes(currentBreedId) || !getCurrentUser()
      ? UnknownCat
      : mythicCatIcons[catIcon];
  };

  const getIconNameForMythicCat = (catIcon, currentBreedId) => {
    var c = cats;
    if (view) {
      c = getCurrentUser().cats;
    }
    return !c.includes(currentBreedId) || !getCurrentUser()
      ? "?????"
      : catIcon.replace(".jpg", "").replace("_", " ");
  };

  const getIconData = (catIcon, currentBreedId, rarity) => {
    var [name, src, imageClass, textColor] = ["", "", "unowned", "grey"];
    if (rarity === "M") {
      src = getIconSrcForMythicCat(catIcon, currentBreedId);
      name = getIconNameForMythicCat(catIcon, currentBreedId);
    } else {
      name = catIcon.replace(".png", "").replace("_", " ").replace(" cat", "");
      src = allCatIcons[catIcon];
    }
    if (cats.includes(currentBreedId)) {
      imageClass = "owned-" + rarity;
      textColor = "white";
    }
    return [name, src, imageClass, textColor];
  };

  const getHref = (rarity, catIcon) => {
    // if in view mode, don't display mythic cats href that the user doesn't own
    const currentBreedId = CATICON_TO_BREEDID[catIcon];
    var c = cats;
    if (view) {
      if (!getCurrentUser()) {
        c = [];
      } else {
        c = getCurrentUser().cats;
      }
    }
    return rarity === "M" && !c.includes(currentBreedId)
      ? "/details/???"
      : `/details/${CATICON_TO_BREEDID[catIcon]}`;
  };

  const skipDisplay = (currentBreedId) => {
    // Don't display the cat if the breed is undefined,
    // or if we are not showing cats the user doesn't own
    return (
      (!showUnowned && !cats.includes(currentBreedId)) ||
      currentBreedId === undefined
    );
  };

  const resetFunction = async () => {
    const icons = await importAll(import.meta.glob("../assets/catIcons/*.png"));
    const mythicIcons = await importAll(
      import.meta.glob("../assets/mythicCatIcons/*.jpg")
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

  async function getUserCats() {
    setIsLoading(true);
    const username = params.username;
    try {
      const user = await getUserByUsername(username);
      const userId = user["_id"];
      const userData = await getUserDataByUserId(userId);
      setCats(userData.cats);
    } catch (error) {
      if ((error.name = "ERR_BAD_REQUEST")) {
        // TODO: nav to 404 page
        return;
      }
    }
  }

  useEffect(() => {
    document.title =
      (favorites ? "favorites | " : rarity ? "rarities | " : "my cats | ") +
      APP_NAME;
    if (!getCurrentUser() && favorites) {
      navigate("/signin");
    } else if (getCurrentUser() && !view) {
      setCats(getCurrentUser().cats);
    }

    if (getCurrentUser() && favorites) {
      const favorites = getCurrentUser().favorites;
      setIsEmptyFavorites(favorites.length === 0);
    } else if (view) {
      getUserCats();
    }

    resetFunction();
  }, []);

  useEffect(() => {
    const renderTitle = () => {
      if (view) {
        if (isLoading) {
          setTitle("loading " + params.username + "'s cats...");
          setIsLoading(false);
        } else {
          setTitle(params.username + "'s cats");
        }
      } else if (favorites) {
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
    <Box sx={{ marginBottom: "10px" }}>
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
          {view ? (
            <></>
          ) : (
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
          )}
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
                const [name, src, imageClass, textColor] = getIconData(
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
                  >
                    <Link
                      textAlign="center"
                      underline="none"
                      color="inherit"
                      href={getHref(rarity, catIcon)}
                      className="hover"
                    >
                      <img
                        className={imageClass}
                        src={src}
                        width={160}
                        height={160}
                        alt={catIcon}
                      />
                      <Typography
                        variant="h5"
                        color={textColor}
                        textAlign="left"
                        position="absolute"
                        marginTop={name.length < 14 ? "-35px" : "-52px"}
                        marginLeft="10px"
                        sx={{
                          textShadow:
                            "2px 1px 1px black, 2px 2px 1px black, 50px 50px 50px black",
                          wordWrap: "break-word",
                          maxWidth: "120px",
                          lineHeight: "0.9",
                        }}
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
    </Box>
  );
}
