import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  APP_NAME,
  CAT_API_KEY,
  CAT_API_URL_BREEDS,
  CAT_API_URL_IMAGE,
  CAT_API_URL_IMAGES,
} from "../constants";
import { Grid, Typography } from "@mui/material";
import { importAll } from "../utils/importAll";
import Heart from "../assets/heart_icon.png";
import Star from "../assets/star_icon.png";
import "../css/styles.css";
import { Button } from "@mui/material";
import { getCurrentUser } from "../client";

const IMAGE_SIZE = 400;

export default function Details() {
  const [breedData, setBreedData] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [imageIdx, setImageIdx] = useState(0);
  const [catIcon, setCatIcon] = useState("");
  const [owned, setOwned] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const params = useParams();
  const id = params.id;
  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/),
  );

  var cats = [];
  if (getCurrentUser()) {
    cats = getCurrentUser().cats;
  }

  useEffect(() => {
    async function getBreedData() {
      const response = await fetch(CAT_API_URL_BREEDS, {
        headers: {
          "x-api-key": CAT_API_KEY,
        },
      });
      const data = await response.json();
      const currentBreed = data.find((breed) => breed.id === id);
      setBreedData(currentBreed);
    }

    async function getImageURLS() {
      const urls = [];
      const response = await fetch(CAT_API_URL_IMAGES.replace("{}", id), {
        headers: {
          "x-api-key": CAT_API_KEY,
        },
      });
      const data = await response.json();
      for (const datum of data) {
        if (datum["url"] !== undefined) {
          urls.push(datum["url"]);
        }
      }
      setImageUrls(urls);
    }

    if (cats.includes(id)) {
      setOwned(true);
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
        : breedData.name.toLowerCase().replace(" ", "_") + ".png";
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

  function toggleIcon() {
    setFavorite(!favorite);
  }

  return (
    <div>
      <Grid
        container
        spacing={2}
        maxHeight="lg"
        maxWidth="lg"
        sx={{ marginTop: 2 }}
      >
        <Grid
          alignItems="center"
          style={{ paddingLeft: "70px" }}
          item
          xs={4}
          sm={5}
          md={6}
        >
          <img
            src={imageUrls[imageIdx]}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            style={{
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: "10px",
              border: "2px solid white",
            }}
            alt={`display`}
          />
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
          <h1 style={{ margin: "0px", marginBottom: "20px" }}>
            {" "}
            {breedData.name}
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
                onClick={toggleIcon}
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
              />{" "}
            </span>
          </h1>
          <h3 style={{ margin: 0 }}> Rarity: </h3>
          <hr></hr>
          <span className="detailTitle">Origin: </span>
          <span className="detail"> {breedData.origin}</span>
          <br></br>
          <span className="detailTitle">Weight: </span>
          <span className="detail">
            {breedData.weight ? breedData.weight.imperial : ""} lbs{" "}
          </span>
          <br></br>
          <span className="detailTitle">Temperament: </span>
          <span className="detail"> {breedData.temperament} </span>
          <br></br>
          <br></br>
          <span className="detailTitle">Adaptability: </span>
          <span className="detail">
            {owned
              ? [...Array(breedData.adaptability)].map((e, i) => (
                  <img src={Star} />
                ))
              : "?????"}
          </span>
          <br></br>
          <span className="detailTitle">Affection: </span>
          <span className="detail">
            {owned
              ? [...Array(breedData.affection_level)].map((e, i) => (
                  <img src={Star} />
                ))
              : "?????"}
          </span>
          <br></br>
          <span className="detailTitle">Energy: </span>
          <span className="detail">
            {owned
              ? [...Array(breedData.energy_level)].map((e, i) => (
                  <img src={Star} />
                ))
              : "?????"}
          </span>
          <br></br>
          <span className="detailTitle">Intelligence: </span>
          <span className="detail">
            {owned
              ? [...Array(breedData.intelligence)].map((e, i) => (
                  <img src={Star} />
                ))
              : "?????"}
          </span>
          <br></br>
          <br></br>
          <span style={{ fontSize: "19px" }}> {breedData.description} </span>
        </Grid>
      </Grid>
    </div>
  );
}
