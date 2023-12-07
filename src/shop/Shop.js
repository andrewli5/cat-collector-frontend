import { Box, Grid, Typography, Item, Container } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import ShopItem from "./ShopItem";
import "../css/styles.css";
import SmallShopItem from "./SmallShopItem";
import shopItems from "./shopItems.json";
export default function Shop() {
  const skills = shopItems.skills;
  const accessories = shopItems.accessories;
  const items = shopItems.items;

  useEffect(() => {
    document.title = "shop | " + APP_NAME;
  }, []);

  return (
    <Grid className="shop" container spacing={1} mb={3}>
      <Grid className="shop" item xs={7} px={3} py={1} p>
      <Typography variant="h4" color="white" textAlign="center"> Accessories </Typography>
          {accessories.map((item, index) => (
            <ShopItem icon={item.icon} title={item.title} description={item.description} price={item.price} filter={item.filter} />
          ))}
      </Grid>
      <Grid className="shop" item xs={5}>
      <Typography variant="h4" color="white" textAlign="center"> Items </Typography>
        <Grid container>
          {items.map((item) => (
            <SmallShopItem icon={item.icon} title={item.title} desc={item.description} price={item.price} filter={item.filter} />
          ))}
        </Grid>
      </Grid>
      <Grid className="shop" item xs={12}>
        <Typography variant="h4" color="white" textAlign="center"> Skills </Typography>
        <Grid container>
          {skills.map((item) => (
            <ShopItem icon={item.icon} title={item.title} description={item.description} price={item.price} filter={item.filter} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

//{skills.map((item) => (
//   <ShopItem 
//   icon={<img src={require(item.icon)} width="100" height="100" />} 
//   title={item.title} 
//   description={item.description} 
//   price={item.price} />
// ))}