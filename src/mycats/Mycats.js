import React, { useEffect } from 'react'
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import "../css/styles.css";
import { APP_NAME, CATICON_TO_BREEDID } from '../constants';
import { getCurrentUser } from '../client';
import { useNavigate } from 'react-router-dom';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

export default function MyCats() {
  const navigate = useNavigate();
  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );

  var cats = [];
  if (getCurrentUser()) {
    cats = getCurrentUser().cats;
  }

  useEffect(() => {
    document.title = "my cats | " + APP_NAME;
    if (!getCurrentUser()) {
      navigate("/signin");
    }
  }, []);

  if (!getCurrentUser()) {
    return null;
  }

  return (
    <>
    <Typography variant="h4" color="white" textAlign="center">
      {"my cats (" + cats.length + "/" + Object.keys(catIcons).length + ")"}
    </Typography>

      <Grid container spacing={0.5} sx={{ marginTop: 3 }}>
        {Object.keys(catIcons).map((catIcon, index) => {
          const name = catIcon.replace(".png", "").replace("_", " "); 
          var textColor = "grey";
          var imageStyle = { WebkitFilter: "grayscale(100%)", border: "1px solid gray"};
          if (cats.includes(CATICON_TO_BREEDID[catIcon])) {
            imageStyle = { border: "1px solid white" };
            textColor = "white"
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
              className='hover'
            >
              <img
                style={{
                  ...imageStyle,
                  borderRadius: "5px",
                }}
                src={catIcons[catIcon]}
                width={60}
                height={60}
                alt={`image-${index}`}
              />
              <Typography variant="h5" color={textColor} textAlign="center">
                {name}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}