import { Typography, Button } from "@mui/material";
import "../css/styles.css";
import Coin from "../assets/coin_icon.png";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function ShopItem({ title, items }) {
  const handlePurchase = () => {
    // TODO: this
  };

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
          <TableRow>
            <TableCell colSpan={2}>
              <Typography color="white" textAlign="center">
                Name
              </Typography>{" "}
            </TableCell>
            <TableCell colSpan={1}>
              <Typography color="white" textAlign="right">
                Description
              </Typography>{" "}
            </TableCell>
            <TableCell colSpan={2}>
              <Typography color="white" textAlign="left">
              <img src={Coin} width={15} height={15} />
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
              <TableCell
                style={{ paddingRight: "0px", paddingLeft: "0px" }}
                align="right"
              >
                <Typography
                  variant="h6"
                  display="inline"
                  nowrap
                  style={{ paddingRight: "0px", display: "inline-block" }}
                >
                  {item.price}
                </Typography>
              </TableCell>
              <TableCell xs={1} md={1} align="right">
                {
                  <Button variant="contained" onClick={handlePurchase}>
                    <Typography variant="h6" color={"white"}>
                      Buy{" "}
                    </Typography>
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
