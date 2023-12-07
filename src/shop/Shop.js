import { Box, Grid, Typography, Item } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import ShopItem from "./ShopItem";

export default function Shop() {
  useEffect(() => {
    document.title = "shop | " + APP_NAME;
  }, []);

  return (
    <Box>
      <Grid container spacing={2}>
        <ShopItem icon="icon" title="title" description="description" price="price" />
        <ShopItem icon="test" title="test" description="test" price="test" />

      </Grid>
    </Box>
  );
}
