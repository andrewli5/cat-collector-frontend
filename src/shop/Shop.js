import { Box, Grid, Typography, Item, Container, ButtonBase } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { APP_NAME } from "../constants";
import ShopItem from "./ShopItem";
import "../css/styles.css";
import SmallShopItem from "./SmallShopItem";
import shopItems from "./shopItems.json";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import Card from "@mui/material/Card";

export default function Shop() {
  const [isVisible, setIsVisible] = useState(true);
  const skills = shopItems.skills;
  const accessories = shopItems.accessories;
  const items = shopItems.items;

  useEffect(() => {
    document.title = "shop | " + APP_NAME;
  }, []);

  return (
    <Grid className="shopContainer" container spacing={1} mb={3}>
      <Grid className="shop" item xs={7} style={{padding: '0px'}}>
        <Typography className="shopTitle" variant="h4" color="white" textAlign="center">
          {" "}
          Accessories{" "}
        </Typography>
        {<ShopItem items={accessories}/>}
      </Grid>
      <Grid className="shop" item xs={5} style={{padding: '0px'}}>
        <Typography className="shopTitle" variant="h4" color="white" textAlign="center">
          {" "}
          Snacks{" "}
        </Typography>
        <Grid container>
          {items.map((item) => (
            <SmallShopItem
              icon={item.icon}
              title={item.title}
              desc={item.description}
              price={item.price}
              filter={item.filter}
            />
          ))}
        </Grid>
      </Grid>
      <Grid className="shop" item xs={12} style={{padding: '0px'}}>
        <Typography className="shopTitle" variant="h4" color="white" textAlign="center">
          {" "}
          Skills{" "}
        </Typography>
        <Grid container>
          <ShopItem items={skills}/>
        </Grid>
      </Grid>
    </Grid>
  );
}
