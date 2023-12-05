import React from 'react'
import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

export default function MyCats() {
  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );

  return (
    <>
      <Typography component="h1" variant="h2" textAlign="center">
        my cats
      </Typography>
      <Grid container spacing={0.5} sx={{ marginTop: 3 }}>
        {Object.keys(catIcons).map((catIcon, index) => {
          const name = catIcon.replace(".png", "").replace("_", " ");
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
              <img
                style={{
                  WebkitFilter: "grayscale(100%)",
                  borderRadius: "5px",
                  border: "1px solid white",
                }}
                src={catIcons[catIcon]}
                width={60}
                height={60}
                alt={`image-${index}`}
              />
              <Typography variant="h5" textAlign="center">
                {name}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}