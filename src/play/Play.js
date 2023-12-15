import { Box, Grid } from "@mui/material";
import Clicker from "./Clicker";
import Roll from "./Roll";

export default function Play({
  coins,
  coinsPerClick,
  setCoinsPerClick,
  coinDiff,
  setCoinDiff,
  setCoins,
  saving,
  setSaving,
  music,
  setWarning,
}) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignContent={"center"}
      alignItems={"center"}
      height="100%"
    >
      <Grid container maxWidth="1100px" maxHeight="30vh">
        <Grid item xs={6}>
          <Clicker
            coins={coins}
            coinsPerClick={coinsPerClick}
            coinDiff={coinDiff}
            setCoinDiff={setCoinDiff}
            setCoins={setCoins}
            saving={saving}
            setSaving={setSaving}
            setWarning={setWarning}
            music={music}
          />
        </Grid>
        <Grid item xs={6}>
          <Roll
            coins={coins}
            setCoinDiff={setCoinDiff}
            setCoins={setCoins}
            music={music}
            setCoinsPerClick={setCoinsPerClick}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
