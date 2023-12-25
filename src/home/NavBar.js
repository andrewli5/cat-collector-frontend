import {
  Typography,
  Grow,
  Box,
  Link,
  IconButton,
  useMediaQuery,
  Button,
} from "@mui/material";
import { getCurrentUser } from "../client";
import coinGif from "../assets/coin_spin.gif";
import { useLocation, useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { useTheme } from "@emotion/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "home", path: "/home" },
  { name: "play", path: "/play" },
  { name: "my cats", path: "/mycats" },
  { name: "shop", path: "/shop" },
  { name: "favorites", path: "/favorites" },
  { name: "find users", path: "/find-users" },
];

if (getCurrentUser() && getCurrentUser().role === "ADMIN") {
  NAV_ITEMS.push({ name: "admin tools", path: "/admin" });
}

const NAV_ITEMS_SM = NAV_ITEMS.slice(0, 2);
const NAV_ITEMS_SM_MENU = NAV_ITEMS.slice(3, NAV_ITEMS.length);

const NAV_ITEMS_MD = NAV_ITEMS.slice(0, 4);
const NAV_ITEMS_MD_MENU = NAV_ITEMS.slice(5, NAV_ITEMS.length);

export default function NavBar({
  coins,
  coinDiff,
  coinDiffVisible,
  music,
  setMusic,
}) {
  const pathName = useLocation().pathname;
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { animatedCoins } = useSpring({
    from: { animatedCoins: 0 },
    to: { animatedCoins: coins },
  });

  const formattedAnimatedCoins = animatedCoins.to((val) =>
    Math.round(val).toLocaleString(),
  );

  const NavItem = ({ name, path }) => {
    return (
      <Box key={name} justifyContent="center" borderRight="1px solid #735290">
        <Link
          typography="h5"
          style={{
            textDecoration: "none",
            marginLeft: 15,
            marginRight: 15,
          }}
          noWrap
          color={
            pathName.includes(path.substring(1, path.length))
              ? "quintenary.main"
              : "white.main"
          }
          href={path}
        >
          {name}
        </Link>
      </Box>
    );
  };

  const NavItemMenuButton = ({ items }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <Button onClick={handleMenuClick} color="white">
          {">"}
        </Button>
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          {items.map(({ name, path }, index) => (
            <MenuItem
              onClick={() => {
                navigate(path);
                setAnchorEl(null);
              }}
              key={index}
            >
              {name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const ResponsiveNavItems = () => {
    if (isSmScreen) {
      return (
        <>
          {NAV_ITEMS_SM.map(({ name, path }, index) => (
            <NavItem name={name} path={path} key={index} />
          ))}
          <NavItemMenuButton items={NAV_ITEMS_SM_MENU} />
        </>
      );
    } else if (isMdScreen) {
      return (
        <>
          {NAV_ITEMS_MD.map(({ name, path }, index) => (
            <NavItem name={name} path={path} key={index} />
          ))}
          <NavItemMenuButton items={NAV_ITEMS_MD_MENU} />
        </>
      );
    } else {
      return NAV_ITEMS.map(({ name, path }, index) => (
        <NavItem name={name} path={path} key={index} />
      ));
    }
  };

  return (
    <div
      style={{
        height: "55px",
        borderBottom: "1px solid #735290",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <ResponsiveNavItems />
      <IconButton
        onClick={() => {
          setMusic(!music);
          localStorage.setItem("music", !music);
        }}
      >
        {music ? (
          <VolumeUpIcon color="white" />
        ) : (
          <VolumeOffIcon color="white" />
        )}
      </IconButton>
      <div
        style={{
          marginLeft: "auto",
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
        }}
      >
        {getCurrentUser() && (
          <>
            <Grow in={coinDiffVisible && coinDiff != 0}>
              <Typography
                variant="h5"
                alignItems="center"
                style={{ marginRight: 12 }}
                color={coinDiff >= 0 ? "lightgreen" : "error"}
              >
                {coinDiff >= 0 ? "+" : "-"}
                {Math.abs(coinDiff).toLocaleString()}
              </Typography>
            </Grow>
            <Typography
              variant="h4"
              alignItems="center"
              style={{ marginRight: 5 }}
              noWrap
            >
              <animated.span>{formattedAnimatedCoins}</animated.span>
            </Typography>
            <img src={coinGif} style={{ height: 40, width: 40 }} />
          </>
        )}
      </div>
    </div>
  );
}
