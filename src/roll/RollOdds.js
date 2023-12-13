import { useEffect, useState } from "react";
import * as client from "../client";
import { RARITY_TO_COLOR, RARITY_TO_STRING } from "../constants";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function RollOdds() {
  const [odds, setOdds] = useState({});

  useEffect(() => {
    const getUserOdds = async () => {
      var allOdds = await client.getOdds();
      var odds = allOdds.BASE;
      const user = client.getCurrentUser();
      if (user) {
        const userData = await client.getUserDataByUserId(
          client.getCurrentUser()._id
        );
        const luckUpgrades = userData["upgrades"].filter((u) =>
          u.includes("LUCK")
        );
        const highestUpgrade = luckUpgrades.sort().reverse()[0];
        odds = allOdds[highestUpgrade];
      }
      setOdds(odds);
      console.log(odds);
    };

    getUserOdds();
  }, []);

  return (
    <TableContainer
      sx={{
        border: "2px solid",
        borderColor: "primary.main",
        borderRadius: 2,
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "black",
        width: "auto",
      }}
    >
      <TableBody>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography
                variant="h4"
                textAlign="center"
                sx={{
                  paddingLeft: 2,
                  paddingRight: 2,
                  bgcolor: "primary.main",
                }}
              >
                roll odds
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        {Object.keys(odds).map((odd) => {
          const rarity = RARITY_TO_STRING[odd];
          const color = RARITY_TO_COLOR[odd];
          const value = odds[odd];
          return (
            <TableRow
              key={odd}
              sx={{
                alignItems: "center",
                width: "100%",
              }}
            >
              <TableCell
                align="left"
                sx={{
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                <Typography variant="h5"> {rarity}</Typography>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  padding: 2,
                  color: color,

                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                <Typography variant="h5">
                  {" "}
                  {(value * 100).toFixed(2)}%
                </Typography>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableContainer>
  );
}
