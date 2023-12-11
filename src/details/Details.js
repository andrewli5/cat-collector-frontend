import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  APP_NAME,
  CAT_API_KEY,
  CAT_API_URL_BREEDS,
  CAT_API_URL_IMAGES,
  RARITY_TO_COLOR,
  RARITY_TO_STRING,
} from "../constants";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { importAll } from "../utils/importAll";
import Heart from "../assets/heart_icon.png";
import Star from "../assets/star_icon.png";
import "../css/styles.css";
import { Button } from "@mui/material";
import { storeCurrentUser, getCurrentUser } from "../client";
import * as client from "../client";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { ALL_CAT_RARITIES } from "../client";
import { useNavigate } from "react-router-dom";

const IMAGE_SIZE = 400;

export default function Details() {
  const [breedData, setBreedData] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [imageIdx, setImageIdx] = useState(0);
  const [catIcon, setCatIcon] = useState("");
  const [owned, setOwned] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [warning, setWarning] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const breedId = params.id;
  const rarity = ALL_CAT_RARITIES["data"].find((b) => b.breed === breedId)[
    "rarity"
  ];

  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );

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

    async function getImageURLS(retries = 2) {
      try {
        const urls = [];
        const response = await fetch(
          CAT_API_URL_IMAGES.replace("{}", breedId),
          {
            headers: {
              "x-api-key": CAT_API_KEY,
            },
          }
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

    getImageURLS();
    getBreedData();
  }, []);

  useEffect(() => {
    document.title =
      breedData.name === undefined
        ? "details | " + APP_NAME
        : breedData.name.toLowerCase() + " | " + APP_NAME;

    const catIconName =
      breedData.name === undefined
        ? ""
        : breedData.name.toLowerCase().replaceAll(" ", "_") + ".png";
    setCatIcon(catIconName);
  }, [breedData]);

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
      setWarning(true);
      return;
    } else {
      if (favorite) {
        setFavorite(false);
        await client.removeUserFavorites(getCurrentUser()._id, breedId);
        const newFavorites = getCurrentUser().favorites.filter(
          (e) => e !== breedId
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

  return (
    <div>
      {warning ? (
        <Snackbar
          open={warning}
          autoHideDuration={5000}
          onClose={() => setWarning(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setWarning(false)}
            severity="warning"
            sx={{ width: "100%" }}
          >
            An error occurred while retrieving cat details. Please try again
            later.
          </Alert>
        </Snackbar>
      ) : (
        <Grid
          container
          spacing={2}
          maxHeight="lg"
          maxWidth="lg"
          sx={{ marginTop: "2px", marginBottom: "15px" }}
        >
          <Grid
            alignItems="center"
            style={{ paddingLeft: "70px" }}
            item
            xs={4}
            sm={5}
            md={6}
          >
            {imageUrls.length === 0 ? (
              <Box
                sx={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CircularProgress color="white" />
              </Box>
            ) : (
              <img
                src={imageUrls[imageIdx]}
                width={IMAGE_SIZE}
                height={IMAGE_SIZE}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: "10px",
                  border: `2px solid ${RARITY_TO_COLOR[rarity]}`,
                }}
                alt={`display`}
              />
            )}
            <Grid
              width={IMAGE_SIZE}
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
          <Grid item xs={10} sm={8} md={6}>
            <Typography
              variant="h3"
              sx={{ margin: "0px", marginBottom: "20px" }}
            >
              {breedData.name !== undefined
                ? breedData.name.replace("Cat", "")
                : ""}
              <Chip
                className="hover"
                onClick={handleChipClick}
                icon={<StarRateRoundedIcon color={RARITY_TO_COLOR[rarity]} />}
                label={RARITY_TO_STRING[rarity]}
                sx={{
                  color: RARITY_TO_COLOR[rarity],
                  border: `1px solid ${RARITY_TO_COLOR[rarity]}`,
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
                    favorite
                      ? "detailsIcon hover"
                      : "detailsIcon hover inactive"
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
                  src={catIcons[catIcon]}
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
            <Typography variant="h6" sx={{ marginTop: "20px" }}>
              {breedData.description}
            </Typography>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
