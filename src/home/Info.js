import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grow,
  Tooltip,
  Typography,
} from "@mui/material";
import { catGif, getCurrentUser } from "../client";
import { APP_NAME } from "../constants";
import { useEffect } from "react";
import * as meows from "../assets/meows";
import "../css/styles.css";
import { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Info({ music }) {
  const [expanded, setExpanded] = useState("panel0");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
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
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Grow in={true} style={{ transformOrigin: "0 0 0" }}>
        <Typography variant="h1" textAlign={"left"} marginLeft="3vh">
          welcome to cat collector!
        </Typography>
      </Grow>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Grow in={true} timeout={800} style={{ transformOrigin: "0 0 0" }}>
          <Tooltip title="meow" placement="right">
            <Box
              component="img"
              src={catGif}
              onClick={playSoundEffect}
              width={"20vh"}
              height={"20vh"}
              marginLeft={"3vh"}
            />
          </Tooltip>
        </Grow>
        <Grow in={true} timeout={1400}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "600px",
              marginLeft: 15,
            }}
          >
            <Accordion
              expanded={expanded === "panel0"}
              onChange={handleChange("panel0")}
            >
              <AccordionSummary
                expandIcon={<KeyboardArrowDownIcon />}
                aria-controls="panel0d-content"
                id="panel0d-header"
              >
                <Typography variant="h4">welcome!</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h5">
                  cat collector is a game about collecting cats.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<KeyboardArrowDownIcon />}
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography variant="h4">earn coins</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h5">
                  click the coin button to get coins based on your current
                  income!
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                expandIcon={<KeyboardArrowDownIcon />}
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography variant="h4">
                  roll for cats and collect them all
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h5">
                  every new cat boosts your income! rarer cats give you a higher
                  income boost. each new cat you get increases your roll cost by
                  30%.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                expandIcon={<KeyboardArrowDownIcon />}
                aria-controls="panel3d-content"
                id="panel3d-header"
              >
                <Typography variant="h4">learn about cats</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h5">
                  use the search bar to search cat breeds and learn more about
                  cats!
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
            >
              <AccordionSummary
                expandIcon={<KeyboardArrowDownIcon />}
                aria-controls="panel4d-content"
                id="panel4d-header"
              >
                <Typography variant="h4">get exciting upgrades</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h5">
                  buy upgrades to increase your luck, critical rate, and more!
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </Grow>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: 15,
          }}
        >
          <Grow in={true} timeout={1800} style={{ transformOrigin: "0 0 0" }}>
            <Typography variant="h5">play now!</Typography>
          </Grow>
          {getCurrentUser() && (
          <Grow
            in={getCurrentUser()}
            timeout={1800}
            style={{ transformOrigin: "0 0 0" }}
          >
            <Button
              variant="contained"
              size="small"
              color="white"
              className="flash-slide"
              href="/play"
              sx={{
                marginTop: 2,
                maxWidth: "250px",
                maxHeight: "50px",
                borderRadius: "40px",
              }}
            >
              <Typography variant="h5">play!</Typography>
            </Button>
          </Grow>)}
          <Grow
            in={!getCurrentUser()}
            timeout={1800}
            style={{ transformOrigin: "0 0 0" }}
          >
            <Button
              variant="outlined"
              size="small"
              className="flash-slide"
              color="white"
              href="/signin"
              sx={{
                marginTop: 2,
                maxWidth: "250px",
                maxHeight: "50px",
                borderRadius: "40px",
              }}
            >
              <Typography variant="h5"> sign in</Typography>
            </Button>
          </Grow>
          <Grow
            in={!getCurrentUser()}
            timeout={1800}
            style={{ transformOrigin: "0 0 0" }}
          >
            <Button
              variant="contained"
              size="small"
              className="flash-slide"
              href="/signin"
              sx={{
                marginTop: 2,
                maxWidth: "250px",
                maxHeight: "50px",
                borderRadius: "40px",
              }}
            >
              <Typography variant="h5"> sign up</Typography>
            </Button>
          </Grow>
        </div>
      </div>
    </Box>
  );
}
