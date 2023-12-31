import { Typography, Button, useMediaQuery } from "@mui/material";
import "../css/styles.css";
import Coin from "../assets/coin_icon.png";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  getCurrentUser,
  purchaseUpgradeForUser,
  storeCurrentUser,
} from "../client";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { UPGRADES } from "../constants";
import { useTheme } from "@emotion/react";

const MAXED = [UPGRADES.LUCK3, UPGRADES.CRIT3, UPGRADES.COST3];

export default function ShopItem({ items, setCoins, updateItems }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));

  const handlePurchase = async (item) => {
    if (!getCurrentUser()) {
      setError(true);
      setErrorMessage("please sign in to purchase.");
      return;
    }
    setLoading(true);
    try {
      await purchaseUpgradeForUser(getCurrentUser()._id, item.id);
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        setCoins(getCurrentUser().coins - item.price);
        storeCurrentUser({
          ...getCurrentUser(),
          coins: getCurrentUser().coins - item.price,
          upgrades: [...getCurrentUser().upgrades, item.id],
        });
        updateItems();
      }, 500);
    } catch (error) {
      if (error.response) {
        setTimeout(() => {
          setLoading(false);
          setError(true);
          setErrorMessage(error.response.data.message);
        }, 500);
        return;
      }
    }
  };

  return (
    <TableContainer>
      <NotificationSnackbar
        open={success}
        setOpen={setSuccess}
        severity="success"
        message="thank you for your purchase!"
        autoHideDuration={3000}
      />
      <NotificationSnackbar
        open={error}
        setOpen={setError}
        severity="error"
        message={errorMessage.toLowerCase()}
        autoHideDuration={3000}
      />
      <Table stickyHeader style={{ backgroundColor: "rgb(25, 18, 31)" }}>
        <TableHead>
          <TableRow>
            <TableCell colSpan={1}></TableCell>
            <TableCell colSpan={1}>
              <Typography color="white" variant="h5" textAlign="left">
                name
              </Typography>{" "}
            </TableCell>
            <TableCell colSpan={1}>
              <Typography color="white" variant="h5" textAlign="left">
                description
              </Typography>{" "}
            </TableCell>
            <TableCell colSpan={1}>
              <Typography color="white" variant="h5" textAlign="left">
                current
              </Typography>{" "}
            </TableCell>
            <TableCell colSpan={1}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              className="shopItem"
              key={item.title || index}
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
                    src={
                      "/images/" + (item.icon ? item.icon : MAXED[index].icon)
                    }
                    width="30"
                    height="30"
                  />
                }
              </TableCell>
              <TableCell align="left">
                <Typography variant="h5">
                  {item.title ? item.title.toLowerCase() : MAXED[index].title}
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h5">
                  {item.description
                    ? item.description.toLowerCase()
                    : MAXED[index].description}
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h5">
                  {item.current
                    ? item.current.toLowerCase()
                    : MAXED[index].description}
                </Typography>
              </TableCell>
              <TableCell xs={1} md={1} align="right">
                {
                  <LoadingButton
                    variant="contained"
                    disabled={
                      !getCurrentUser() ||
                      !item.title ||
                      getCurrentUser().coins < item.price
                    }
                    onClick={() => handlePurchase(item)}
                    loading={loading}
                    sx={{ minWidth: "max-content", whiteSpace: "nowrap" }}
                  >
                    {isMdScreen && (
                      <Typography variant="h5" color="white" marginRight={1}>
                        buy |
                      </Typography>
                    )}
                    <Typography variant="h5" color="white" marginRight={0.7}>
                      {item.price ? item.price.toLocaleString() : "BOUGHT"}
                    </Typography>
                    <img src={Coin} width={15} height={15} />
                  </LoadingButton>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
