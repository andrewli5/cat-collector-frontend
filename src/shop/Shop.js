import { Box, Grid, Typography, Item, Container } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import ShopItem from "./ShopItem";
import "../css/styles.css";

export default function Shop() {
  useEffect(() => {
    document.title = "shop | " + APP_NAME;
  }, []);

  return (
    <Grid className="shop" container spacing={1}>
      <Grid className="shop" item xs={7}>
        <Grid container spacing={1} maxHeight={'100vh'} overflow="auto">
          <ShopItem icon="cat1.png" title="test title." description="test description. i am writing words." name="cat1" price="1,000,000" />
          <ShopItem icon="cat1.png" title="test title." description="test description. i am writing words." name="cat1" price="1,000,000" />
        </Grid>
      </Grid>
      <Grid className="shop" item xs={5}>
        <Grid container spacing={1}>
          <Grid item>
            icon
          </Grid>
          <Grid item xs={2}>
            title
          </Grid>
          <Grid item xs={5}>
            desc
          </Grid>
          <Grid item xs={3}>
            1,000,000
          </Grid>
        </Grid>
      </Grid>
      <Grid className="shop" item xs={12}>
        <Grid container>
          <Grid item xs={12}>
            <ShopItem icon="cat3.png" title="test title3." description="test description3" name="cat1" price={100} />

          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
