import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import ShopItem from "./ShopItem";
import "../css/styles.css";
import shopItems from "./shopItems.json";

export default function Shop() {
  const skills = shopItems.skills;
  const accessories = shopItems.accessories;
  const items = shopItems.items;

  useEffect(() => {
    document.title = "shop | " + APP_NAME;
  }, []);

  return (
    <>
      <Typography variant="h3" textAlign="center" marginBottom={3}>
        shop
      </Typography>
      <Grid className="shopContainer" container spacing={1} mb={3}>
        <Grid className="shop" item xs={7} style={{ padding: "0px" }}>
          {<ShopItem title="Accessories" items={accessories} />}
        </Grid>
        <Grid className="shop" item xs={5} style={{ padding: "0px" }}>
          <ShopItem title="Items" items={items} />
        </Grid>
        <Grid className="shop" item xs={12} style={{ padding: "0px" }}>
          <ShopItem title="Skills" items={skills} />
        </Grid>
      </Grid>
    </>
  );
}
