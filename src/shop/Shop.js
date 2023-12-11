import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { APP_NAME } from "../constants";
import ShopItem from "./ShopItem";
import "../css/styles.css";
import { getCurrentUser } from "../client";
import { UPGRADES } from "../constants";

function getShopItemStrings() {
  const items = {
    luck: "LUCK1",
    crit: "CRIT1",
    cost: "COST1",
  };
  if (!getCurrentUser()) {
    return items;
  }

  const upgrades = getCurrentUser().upgrades;

  if (upgrades.length === 0) {
    return items;
  }

  if (upgrades.includes("LUCK3")) {
    items.luck = null;
  } else if (upgrades.includes("LUCK2")) {
    items.luck = "LUCK3";
  } else if (upgrades.includes("LUCK1")) {
    items.luck = "LUCK2";
  }

  if (upgrades.includes("CRIT3")) {
    items.crit = null;
  } else if (upgrades.includes("CRIT2")) {
    items.crit = "CRIT3";
  } else if (upgrades.includes("CRIT1")) {
    items.crit = "CRIT2";
  }

  if (upgrades.includes("COST3")) {
    items.cost = null;
  } else if (upgrades.includes("COST2")) {
    items.cost = "COST3";
  } else if (upgrades.includes("COST1")) {
    items.cost = "COST2";
  }

  return items;
}

function getShopItems() {
  const strings = getShopItemStrings();

  return [
    { ...UPGRADES[strings.luck], id: strings.luck },
    { ...UPGRADES[strings.crit], id: strings.crit },
    { ...UPGRADES[strings.cost], id: strings.cost },
  ];
}

export default function Shop({ setCoins }) {
  const [items, setItems] = useState(getShopItems());
  
  const updateItems = () => {
    setItems(getShopItems());
  }

  useEffect(() => {
    document.title = "shop | " + APP_NAME;
  }, []);

  return (
    <>
      <Typography variant="h3" textAlign="center" marginBottom={3}>
        shop
      </Typography>
      <Grid className="shopContainer" container spacing={1} mb={3}>
        <Grid className="shop" item xs={12} style={{ padding: "0px" }}>
          <ShopItem title="Upgrades" items={items} setCoins={setCoins} updateItems={updateItems} />
        </Grid>
      </Grid>
    </>
  );
}
