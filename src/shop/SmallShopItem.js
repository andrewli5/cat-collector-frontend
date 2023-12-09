import { Box, Grid, Typography, Button, Item, Container } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";
import ShopItem from "./ShopItem";
import "../css/styles.css";
import Coin from "../assets/coin_icon.png";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function SmallShopItem({ items, title }) {
  return (
    <TableContainer>
      <Table stickyHeader style={{ backgroundColor: "rgb(25, 18, 31)" }}>
        <TableHead>
          <TableRow>
            <TableCell colSpan={6}>
              <Typography
                className="shopTitle"
                variant="h4"
                color="white"
                textAlign="center"
              >
                {title}
              </Typography>{" "}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              className="shopItem"
              key={item.title}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {
                  <img
                    className="shopItemIcon"
                    style={
                      item.filter
                        ? { filter: `hue-rotate(${item.filter}deg)` }
                        : {}
                    }
                    src={"/images/" + item.icon}
                    width="30"
                    height="30"
                  />
                }
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6">{item.title} </Typography>
              </TableCell>
              <TableCell align="right">
                {" "}
                <Typography variant="h6">{item.description} </Typography>
              </TableCell>
              <TableCell px={0} align="right">
                <Typography variant="h6">
                  {item.price}
                  <img src={Coin} width={15} height={15} />
                </Typography>
              </TableCell>
              <TableCell xs={1} md={1} align="right">
                {
                  <Button>
                    <Typography variant="h6">Buy </Typography>
                    <img
                      src={"/images/" + "money_bag.png"}
                      width={20}
                      height={20}
                    />
                  </Button>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    // <Grid className={"shopItem smallHover"}container item spacing={2} mx={0} mr={1} mt={1} style={{paddingLeft: 0, backgroundColor: "#19121f"}}>
    //   <Grid item>
    //     {console.log(icon)}
    //     {
    //       <img
    //         style={filter ? {filter: `hue-rotate(${filter}deg)`} : {}}
    //         src={"/images/" + icon}
    //         alt="icon"
    //         width="30"
    //         height="30"
    //       />
    //     }
    //   </Grid>
    //   <Grid item xs={2}>
    //     {title}
    //   </Grid>
    //   <Grid item xs={5}>
    //     {desc}
    //   </Grid>
    //   <Grid item xs={2}>
    //     {price}
    //     <img style={{marginLeft: '5px'}}src={Coin} height={20} width={20} />
    //   </Grid>
    // </Grid>
  );
}
