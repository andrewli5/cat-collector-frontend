import { Box, Button, Fade, Grid, Typography, useMediaQuery } from "@mui/material";
import { catGif, getCurrentUser } from "../client";
import { APP_NAME } from "../constants";
import { useEffect } from "react";
import * as meows from "../assets/meows";
import "../css/styles.css";
import { useTheme } from "@emotion/react";

export default function Info({ music }) {
  const getAnimationDelay = (index) => {
    return { transitionDelay: index * 100 };
  };
  
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up('md'));

  const meowFiles = [
    meows.meow,
    meows.meow1,
    meows.meow2,
    meows.meow3,
    meows.meow4,
    meows.meow5,
    meows.meow6,
    meows.meow7,
  ];

  const playSoundEffect = () => {
    if (!music) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * meowFiles.length);
    const audio = new Audio(meowFiles[randomIndex]);
    audio.play();
  };

  useEffect(() => {
    document.title = "home | " + APP_NAME;
  }, []);
  return (
    <Box
      component="div"
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop={5}
    >
      <Grid container maxWidth="1000px" alignItems="center" marginLeft={3}>
        <Grid item xs={12}>
          <Fade style={getAnimationDelay(0)} in timeout={1000}>
            <Box
              component="img"
              src={catGif}
              onClick={playSoundEffect}
              width={"20vh"}
              height={"20vh"}
            />
          </Fade>
        </Grid>
        <Grid item xs={12}>
          <Fade style={getAnimationDelay(1)} in timeout={1000}>
            <Typography variant={isMdScreen ? "super" : "h1"} textAlign="left">
              let's collect cats.
            </Typography>
          </Fade>
        </Grid>
        <Grid item xs={12}>
          <Fade style={getAnimationDelay(2)} in timeout={1000}>
            <Typography variant={isMdScreen ? "h5" : "body1"} textAlign="left" color="grey">
              learn about cats. earn coins. roll for cats. collect them all.
            </Typography>
          </Fade>
        </Grid>
        <Grid item xs={2} marginTop={3}>
          {getCurrentUser() && (
            <Fade
              style={getAnimationDelay(3)}
              in={getCurrentUser() !== null}
              timeout={1000}
            >
              <Button
                variant="contained"
                color="white"
                className="flash-slide"
                href="/play"
                sx={{
                  borderRadius: "30px",
                }}
              >
                <Typography variant="h4">play now!</Typography>
              </Button>
            </Fade>
          )}
          <div
            style={{ display: "flex", flexDirection: "row", width: "500px" }}
          >
            <Fade
              in={!getCurrentUser()}
              timeout={1800}
              style={getAnimationDelay(3)}
            >
              <Button
                variant="outlined"
                size="small"
                className="flash-slide"
                color="white"
                href="/signin"
                sx={{
                  borderRadius: "30px",
                }}
              >
                <Typography variant="h4"> sign in</Typography>
              </Button>
            </Fade>
            <Fade
              in={!getCurrentUser()}
              timeout={1800}
              style={getAnimationDelay(3)}
            >
              <Button
                variant="contained"
                className="flash-slide"
                href="/signin"
                sx={{
                  marginLeft: 2,
                  borderRadius: "30px",
                }}
              >
                <Typography variant="h4"> sign up</Typography>
              </Button>
            </Fade>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
