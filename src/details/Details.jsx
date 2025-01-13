import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import mythicCatData from "../assets/mythicCatData.json";
import {
  APP_NAME,
  CAT_API_KEY,
  CAT_API_URL_BREEDS,
  CAT_API_URL_IMAGES,
  RARITY_TO_TEXT_COLOR,
  RARITY_TO_STRING,
} from "../constants";
import { Box, Chip, Grid, Typography } from "@mui/material";
import Heart from "../assets/heart_icon.png";
import Star from "../assets/star_icon.png";
import "../css/styles.css";
import { Button } from "@mui/material";
import { storeCurrentUser, getCurrentUser } from "../client";
import * as client from "../client";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { useNavigate } from "react-router-dom";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import JumpingCat from "../assets/gifs/jumping_cat.gif";
import { CatCollectorContext } from "../context/CatCollectorProvider";

const IMAGE_HEIGHT = 400;
const IMAGE_WIDTH = IMAGE_HEIGHT * 1.2;

export default function Details() {
  const { catIcons, mythicCatIcons, gameInfo } = useContext(CatCollectorContext);
  const [breedData, setBreedData] = useState("");
  const [rarity, setRarity] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [imageIdx, setImageIdx] = useState(0);
  const [currentIcon, setCurrentIcon] = useState("");
  const [owned, setOwned] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [warning, setWarning] = useState(false);
  const [logInWarning, setLogInWarning] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const breedId = params.id;

  var cats = [];
  if (getCurrentUser()) {
    cats = getCurrentUser().cats;
  }

  var favorites = [];
  if (getCurrentUser()) {
    favorites = getCurrentUser().favorites;
  }

  const handleChipClick = () => {
    navigate(`/rarities/${rarity}`);
  };

  function nextImage() {
    setImageIdx((imageIdx + 1) % imageUrls.length);
  }

  function prevImage() {
    const idx = imageIdx - 1;
    if (idx < 0) {
      setImageIdx(imageUrls.length - 1);
    } else {
      setImageIdx((imageIdx - 1) % imageUrls.length);
    }
  }

  const handleFavorite = async () => {
    if (!getCurrentUser()) {
      setLogInWarning(true);
      return;
    } else {
      if (favorite) {
        setFavorite(false);
        await client.removeUserFavorites(getCurrentUser()._id, breedId);
        const newFavorites = getCurrentUser().favorites.filter(
          (e) => e !== breedId,
        );
        const user = { ...getCurrentUser(), favorites: newFavorites };
        storeCurrentUser(user);
      } else {
        setFavorite(true);
        await client.addUserFavorites(getCurrentUser()._id, breedId);
        const newFavorites = getCurrentUser().favorites;
        newFavorites.push(breedId);
        const user = { ...getCurrentUser(), favorites: newFavorites };
        storeCurrentUser(user);
      }
    }
  };

  const getMythicCatData = () => {
    if (breedId === "rory") {
      return mythicCatData.rory;
    } else if (breedId === "mimi") {
      return mythicCatData.mimi;
    }
  };

  useEffect(() => {
    async function getBreedData(retries = 2) {
      try {
        const response = await fetch(CAT_API_URL_BREEDS, {
          headers: {
            "x-api-key": CAT_API_KEY,
          },
        });
        const data = await response.json();
        const currentBreed = data.find((breed) => breed.id === breedId);
        setBreedData(currentBreed);
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          getBreedData((retries -= 1));
        } else {
          setWarning(true);
        }
      }
    }

    async function getImageUrls(retries = 2) {
      try {
        const urls = [];
        const response = await fetch(
          CAT_API_URL_IMAGES.replace("{}", breedId),
          {
            headers: {
              "x-api-key": CAT_API_KEY,
            },
          },
        );
        const data = await response.json();
        for (const datum of data) {
          if (datum["url"] !== undefined) {
            urls.push(datum["url"]);
          }
        }
        setImageUrls(urls);
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          getImageURLS((retries -= 1));
        } else {
          setWarning(true);
        }
      }
    }

    if (cats.includes(breedId)) {
      setOwned(true);
    }

    if (favorites.includes(breedId)) {
      setFavorite(true);
    }

    const r = gameInfo.rarities.find((b) => b.breed === breedId)["rarity"];
    setRarity(r);
    if (r === "M") {
      if (!cats.includes(breedId)) {
        // nav away from this page because they don't even own this mythic cat
        navigate("/details/???");
      }
      const images = getMythicCatImages();
      const currentBreed = getMythicCatData();
      setImageUrls(Object.values(images));
      setBreedData(currentBreed);
    } else {
      getImageUrls();
      getBreedData();
    }
  }, []);

  useEffect(() => {
    document.title =
      breedData.name === undefined
        ? "details | " + APP_NAME
        : breedData.name.toLowerCase() + " | " + APP_NAME;

    const icon =
      breedData.name === undefined
        ? ""
        : breedData.name.toLowerCase().replaceAll(" ", "_") +
          (rarity === "M" ? ".jpg" : ".png");
    setCurrentIcon(icon);
  }, [breedData]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <NotificationSnackbar
        open={warning}
        setOpen={setWarning}
        severity="error"
        message={
          "An error occurred while retrieving cat details. Please try again later."
        }
        autoHideDuration={5000}
      />
      <NotificationSnackbar
        open={logInWarning}
        setOpen={setLogInWarning}
        severity="error"
        message={"please log in to favorite a cat!"}
        autoHideDuration={5000}
      />
      <Grid
        container
        spacing={2}
        maxHeight="lg"
        maxWidth="lg"
        sx={{ marginTop: "2px", marginBottom: "15px" }}
      >
        <Grid style={{ paddingLeft: "70px" }} item xs={4} sm={5} md={6}>
          {imageUrls.length === 0 ? (
            <Box
              sx={{
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img src={JumpingCat} />
              <Typography variant="h4" sx={{ marginTop: "10px" }}>
                Loading...
              </Typography>
            </Box>
          ) : (
            <img
              src={imageUrls[imageIdx]}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: "15px",
                boxShadow: `0px 0px 10px ${RARITY_TO_TEXT_COLOR[rarity]}`,
                border: `3px solid ${RARITY_TO_TEXT_COLOR[rarity]}`,
              }}
              alt={`display`}
            />
          )}
          <Grid
            width={IMAGE_HEIGHT * 1.2}
            justifyContent={"center"}
            container
            spacing={1}
          >
            <Grid item>
              <Button variant="contained" onClick={prevImage}>
                <Typography variant="h4"> {"<"} </Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={nextImage}>
                <Typography variant="h4"> {">"} </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={10} sm={8} md={5}>
          <Typography variant="h3" sx={{ margin: "0px", marginBottom: "20px" }}>
            {breedData.name !== undefined
              ? breedData.name.replace("Cat", "")
              : ""}
            <Chip
              className="hover"
              onClick={handleChipClick}
              icon={
                <StarRateRoundedIcon color={RARITY_TO_TEXT_COLOR[rarity]} />
              }
              label={
                <Typography variant="h6">{RARITY_TO_STRING[rarity]}</Typography>
              }
              sx={{
                fontSize: "16px",
                color: RARITY_TO_TEXT_COLOR[rarity],
                border: `1px solid ${RARITY_TO_TEXT_COLOR[rarity]}`,
                marginLeft: "5px",
              }}
              variant="outlined"
            />
            <span title="Owned">
              <img
                className={
                  owned ? "detailsIcon hover" : "detailsIcon hover inactive"
                }
                src={Star}
                width={21}
                height={21}
                alt={`star`}
              />
            </span>
            <span title="Favorite">
              <img
                className={
                  favorite ? "detailsIcon hover" : "detailsIcon hover inactive"
                }
                src={Heart}
                width={21}
                height={21}
                alt={`heart`}
                onClick={handleFavorite}
              />
            </span>
            <span style={{ float: "right" }}>
              {" "}
              <img
                style={{ float: "right" }}
                src={catIcons[currentIcon] || mythicCatIcons[currentIcon]}
                width={60}
                height={60}
                alt={`icon`}
              />
            </span>
          </Typography>
          <hr></hr>
          <Typography variant="h5">
            Origin:
            <Box variant="div" className="detail">
              {breedData.origin}
            </Box>
          </Typography>
          <Typography variant="h5">
            Weight:
            <Box variant="div" className="detail">
              {breedData.weight ? breedData.weight.imperial : ""} lbs{" "}
            </Box>
          </Typography>
          <br></br>
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 7">
              <Typography variant="h5">Temperament:</Typography>
            </Box>
            <Box
              className="detail"
              sx={{ textAlign: "right", display: "flex" }}
              gridColumn="span 5"
            >
              <Typography variant="h6"> {breedData.temperament}</Typography>
            </Box>
          </Box>
          <Typography variant="h5">
            Adaptability:
            <Box className="detail" variant="div">
              {owned
                ? [...Array(breedData.adaptability)].map((e, i) => (
                    <img src={Star} />
                  ))
                : "?????"}
            </Box>
          </Typography>
          <Typography variant="h5">
            Affection:
            <Box variant="div" className="detail">
              {owned
                ? [...Array(breedData.affection_level)].map((e, i) => (
                    <img src={Star} />
                  ))
                : "?????"}
            </Box>
          </Typography>
          <Typography variant="h5">
            Energy:{" "}
            <Box variant="div" className="detail">
              {" "}
              {owned
                ? [...Array(breedData.energy_level)].map((e, i) => (
                    <img src={Star} />
                  ))
                : "?????"}
            </Box>
          </Typography>
          <Typography variant="h5">
            Intelligence:{" "}
            <Box variant="div" className="detail">
              {" "}
              {owned
                ? [...Array(breedData.intelligence)].map((e, i) => (
                    <img src={Star} />
                  ))
                : "?????"}
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ marginTop: "20px" }}>
            {breedData.description}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
