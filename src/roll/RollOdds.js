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
      const user = client.getCurrentUser();
      if (!user) {
        // get base roll odds instead
        return;
      }
      const userOdds = await client.getOdds();
      const userData = await client.getUserDataByUserId(
        client.getCurrentUser()._id
      );

      const luckUpgrades = userData["upgrades"].filter((u) =>
        u.includes("LUCK")
      );
      const highestUpgrade = luckUpgrades.sort().reverse()[0];
      const odds = userOdds[highestUpgrade];
      setOdds(odds);
      console.log(odds);
    };

    getUserOdds();
  }, []);

  return (
    <TableContainer
      sx={{
        border: "4px solid",
        borderColor: "primary.main",
        borderRadius: 2,
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "rgb(25, 18, 31)",
        width: "auto",
      }}
    >
      <TableBody>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography variant="h3" textAlign="center">
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
                  border: "1px solid",
                  borderColor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: color,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                <Typography variant="h5"> {rarity}</Typography>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontSize: 20,
                  fontWeight: "bold",
                  border: "1px solid",
                  borderColor: "primary.main",
                }}
              >
                <Typography variant="h5"> {value * 100}%</Typography>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableContainer>
  );
}
