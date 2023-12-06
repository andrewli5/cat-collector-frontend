import React, { useEffect } from 'react'
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import "../css/styles.css";
import { APP_NAME } from '../constants';
import { importAll } from '../utils/importAll';

export default function MyCats() {
  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );

  useEffect(() => {
    document.title = "my cats | " + APP_NAME;
  }, []);

  return (
    <>
    <Typography variant="h4" color="white" textAlign="center">
       {"my cats (0/67)"}
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
              xs={4}
              sm={2}
              key={index}
              sx={{ marginBottom: 3 }}
              className='hover'
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