import { Box, Typography } from "@mui/material";
import {
  BREEDID_TO_CATICON,
  RARITY_TO_STRING,
  RARITY_TO_TEXT_COLOR,
} from "../constants";
import { catGif } from "../client";
import coin from "../assets/coin_icon.png";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";

export default function RollResultsMessage({ rollResults }) {
  const getNewCatUnlockedTitle = () => {
    const imgSize = 25;
    return (
      <>
        <img
          src={catGif}
          width={imgSize}
          height={imgSize}
          style={{ marginRight: "5px" }}
        />
        new cat unlocked!
        <img src={catGif} width={imgSize} height={imgSize} />
      </>
    );
  };

  return (
    <>
      <Typography variant="h4" color={"white"} textAlign="center">
        {rollResults["duplicate"] ? "you rolled:" : getNewCatUnlockedTitle()}
      </Typography>
      <Typography variant="h3" textAlign="center" color="white">
        <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
          {BREEDID_TO_CATICON[rollResults["breed"]]
            .replace(".png", "")
            .replace("_", " ")}
        </Box>
      </Typography>
      <Typography
        variant="h4"
        display="flex"
        justifyContent={"center"}
        color={RARITY_TO_TEXT_COLOR[rollResults["rarity"]]}
      >
        {RARITY_TO_STRING[rollResults["rarity"]].toLowerCase()}
        <Box>
          {" "}
          <StarRateRoundedIcon
            fontSize="large"
            sx={{ color: RARITY_TO_TEXT_COLOR[rollResults["rarity"]] }}
          />
        </Box>
      </Typography>
      {rollResults["duplicate"] ? (
        <Box
          alignItems={"center"}
          display={"flex"}
          justifyContent="center"
          textAlign="center"
        >
          {"duplicate, received:  "}
          {rollResults["addedCoins"].toLocaleString()}
          <img
            style={{ marginLeft: "5px" }}
            src={coin}
            width={20}
            height={20}
          />
        </Box>
      ) : (
        <Box alignItems="center" display="flex" textAlign="center">
          coins per click: {rollResults["oldCoinsPerClick"]}
          <img
            style={{ marginLeft: "2px", marginRight: "5px" }}
            src={coin}
            width={20}
            height={20}
          />
          ⇒ {rollResults["newCoinsPerClick"]}
          <img
            style={{ marginRight: "5px" }}
            src={coin}
            width={20}
            height={20}
          />
          {"  (+" + ((rollResults["multiplier"] - 1) * 100).toFixed(0) + "%)"}
        </Box>
      )}
    </>
  );
}
