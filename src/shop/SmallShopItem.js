import { Box, Grid, Typography, Item, Container } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import ShopItem from "./ShopItem";
import "../css/styles.css";

export default function SmallShopItem({ icon, title, desc, price }) {
  return (
    <Grid container item spacing={2}>
      <Grid item>
        {console.log(icon)}
        {
          <img
            src={require("../assets/fish_icon.png")}
            alt="icon"
            width="30"
            height="30"
          />
        }
      </Grid>
      <Grid item xs={2}>
        {title}
      </Grid>
      <Grid item xs={5}>
        {desc}
      </Grid>
      <Grid item xs={2}>
        {price}
      </Grid>
    </Grid>
  );
}
