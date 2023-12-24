import { useEffect, useState } from "react";
import * as client from "../client";
import { RARITY_TO_STRING, RARITY_TO_BG_COLOR } from "../constants";
import {
  Table,
  // Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function RollOdds() {
  const [odds, setOdds] = useState({});
  const cellBorderColor = "#363457";

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
        if (highestUpgrade) {
          odds = allOdds[highestUpgrade];
        }
      }
      setOdds(odds);
    };

    getUserOdds();
  }, []);

  return (
    <TableContainer
      sx={{
        border: "4px solid",
        borderColor: "secondary.main",
        borderRadius: 2,
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: "auto",
        bgcolor: "black",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              padding="none"
              sx={{
                bgcolor: "primary.main",
                borderBottom: `2px solid ${cellBorderColor}`,
                borderRight: `1px solid ${cellBorderColor}`,
              }}
            >
              <Typography
                variant="h4"
                textAlign="center"
                sx={{
                  paddingLeft: 2,
                  paddingRight: 2,
                  paddingTop: "5px",
                  paddingBottom: "5px",
                }}
              >
                rarity
              </Typography>
            </TableCell>
            <TableCell
              padding="none"
              sx={{
                bgcolor: "primary.main",
                borderBottom: `2px solid ${cellBorderColor}`,
              }}
            >
              <Typography
                variant="h4"
                textAlign="center"
                sx={{
                  paddingLeft: 2,
                  paddingRight: 2,
                }}
              >
                odds
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(odds).map((odd, index) => {
            const rarity = RARITY_TO_STRING[odd];
            const bgcolor = RARITY_TO_BG_COLOR[odd];
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
                  padding="none"
                  sx={{
                    paddingLeft: 2,
                    paddingRight: 2,
                    color: "black",
                    backgroundColor: bgcolor,
                    fontSize: 20,
                    fontWeight: "bold",
                    borderTop: `1px solid ${cellBorderColor}`,
                    borderRight: `1px solid ${cellBorderColor}`,
                  }}
                >
                  <Typography
                    display="flex"
                    flexDirection="row"
                    justifyContent="left"
                    variant="h5"
                  >
                    {rarity}
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  padding="none"
                  sx={{
                    paddingLeft: 2,
                    paddingRight: 2,
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    backgroundColor: bgcolor,
                    color: "black",
                    borderTop: `1px solid ${cellBorderColor}`,
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
      </Table>
    </TableContainer>
  );
}
