import { Box, Grid, Typography, Item, Container } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import ShopItem from "./ShopItem";
import "../css/styles.css";

export default function SmallShopItem({ icon, title, desc, price, filter=false }) {

  return (
    <Grid container item spacing={2} mx={0} mr={1} mt={1} style={{paddingLeft: 0, backgroundColor: "#19121f"}}>
      <Grid item>
        {console.log(icon)}
        {
          <img
            style={filter ? {filter: `hue-rotate(${filter}deg)`} : {}}
            src={"/images/" + icon}
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
