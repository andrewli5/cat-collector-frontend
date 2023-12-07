import { Grid, Box, Typography } from "@mui/material";

export default function ShopItem({ icon, title, description, price }) {
  return (
    <Grid container item spacing={2}>
      <Grid item xs={3} md={2} flex={1} minWidth={30}>
        {
          <img
            src={require("../assets/fish_icon.png")}
            alt="icon"
            width="30"
            height="30"
          />
        }
      </Grid>
      <Grid item xs={3} md={3} flex={1} flexWrap="wrap">
        <Typography>{title}</Typography>
      </Grid>
      <Grid item xs={4} md={5} flex={1} flexWrap="wrap">
        <Typography>{description}</Typography>
      </Grid>
      <Grid item xs={1} md={2} flex={1}>
        <Typography>{price}</Typography>
      </Grid>
    </Grid>
  );
}
