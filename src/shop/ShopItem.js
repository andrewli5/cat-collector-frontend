import { Grid, Box, Typography, ButtonBase, Button } from "@mui/material";
import "../css/styles.css";
import Coin from "../assets/coin_icon.png";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CheckBox } from "@mui/icons-material";

export default function ShopItem({ items, filter = false }) {
  return (
    <TableContainer>
      <Table
        style={{backgroundColor: "rgb(25, 18, 31)" }}
      >
        <TableHead style={{ overflowX: "auto"}}>
          <TableRow>
            <TableCell>
              <Typography variant="h5">Icon</Typography>
            </TableCell>
            <TableCell align="left">
              <Typography variant="h5">Name</Typography>
            </TableCell>
            <TableCell align="right">
              {" "}
              <Typography variant="h5">Description</Typography>
            </TableCell>
            <TableCell align="right">
              <img
                src={Coin}
                height={17}
                width={17}
                style={{ marginLeft: "5px" }}
              />
            </TableCell>
            <TableCell align="right"> </TableCell>
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
                <Typography variant="h6">{item.price} </Typography>
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
  );
}

{
  /* <Grid
      className="shopItem smallHover"
      container
      item
      spacing={1}
      mt={1}
      mx={0}
      px={0}
      style={{ paddingLeft: 0, marginRight: 5, backgroundColor: "#19121f" }}
    >
      <Grid item xs={3} md={2} px={0} flex={1} minWidth={20}>
        {
          <img
            className="shopItemIcon"
            style={filter ? { filter: `hue-rotate(${filter}deg)` } : {}}
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
        <Typography>
          {price}
          <img style={{marginLeft: '5px'}}src={Coin} height={20} width={20} />
        </Typography>
      </Grid>
    </Grid> */
}
