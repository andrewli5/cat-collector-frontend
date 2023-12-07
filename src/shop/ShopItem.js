import { Grid, Box, Typography } from "@mui/material";
import "../css/styles.css";

export default function ShopItem({ icon, title, description, price, filter=false }) {

  return (
    <Grid className="shopItem" container item spacing={1} mt={1} mx={0} px={0} style={{paddingLeft: 0, marginRight: 5, backgroundColor: "#19121f"}}>
      <Grid item xs={3} md={2} px={0} flex={1} minWidth={20} >
        {
          <img
            className="shopItemIcon"
            style={filter ? {filter: `hue-rotate(${filter}deg)`} : {}}
            src={"/images/" + icon}
            width="30"
            height="30"
          />
        }
      </Grid>
      <Grid item xs={3} md={3} px={0} flex={1} flexWrap="wrap">
        <Typography>{title}</Typography>
      </Grid>
      <Grid item xs={4} md={5} px={0} flex={1} flexWrap="wrap">
        <Typography>{description}</Typography>
      </Grid>
      <Grid item xs={1} md={2} px={0} flex={1}>
        <Typography>{price}</Typography>
      </Grid>
    </Grid>
  );
}
