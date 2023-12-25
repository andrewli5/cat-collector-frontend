import { useState } from "react";
import { Box, Grid } from "@mui/material";
import { importAll } from "../utils/importAll";
import Icon from "../assets/cat_face_silhouette.png";

export default function SelectProfilePhoto() {
  const [photo, setPhoto] = useState(null);
  const icons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );

  return (
    <Box>
      <Grid
        container
        sx={{ maxWidth: "50vh", maxHeight: "50vh", overflow: "scroll" }}
      >
        {Object.keys(icons).map((icon) => (
          <Grid item>
            <Box
              component="img"
              src={icons[icon]}
              sx={{
                border: "1px solid white",
                borderRadius: "80px",
                width: "15vh",
                height: "15vh",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
