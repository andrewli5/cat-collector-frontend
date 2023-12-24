import { Typography, Grow, Box, Link } from "@mui/material";
import { getCurrentUser } from "../client";
import coinGif from "../assets/coin_spin.gif";
import { useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useLayoutEffect } from "react";

const NAV_ITEMS = [
  { name: "home", path: "/home" },
  { name: "play", path: "/play" },
  { name: "my cats", path: "/mycats" },
  { name: "shop", path: "/shop" },
  { name: "favorites", path: "/favorites" },
  { name: "my profile", path: "/myprofile" },
  { name: "find users", path: "/find-users" },
];

export default function NavBar({ coins, coinDiff, coinDiffVisible }) {
  const pathName = useLocation().pathname;

  const { animatedCoins } = useSpring({
    from: { animatedCoins: 0 },
    to: { animatedCoins: coins },
  });
  const formattedAnimatedCoins = animatedCoins.to((val) =>
    Math.round(val).toLocaleString(),
  );

  useLayoutEffect(() => {
    if (
      getCurrentUser() &&
      getCurrentUser().role === "ADMIN" &&
      !NAV_ITEMS.find(({ name }) => name === "admin tools")
    ) {
      NAV_ITEMS.push({ name: "admin tools", path: "/admin" });
    }
  }, []);

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
      {NAV_ITEMS.map(({ name, path }, index) => {
        return (
          <Box
            key={name}
            justifyContent="center"
            borderRight={
              index !== NAV_ITEMS.length - 1 ? "1px solid #735290" : ""
            }
          >
            <Link
              typography="h5"
              style={{
                textDecoration: "none",
                padding: "0 20px",
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
      })}
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
            <img
              src={coinGif}
              style={{ marginLeft: 5, height: 40, width: 40 }}
            />
          </>
        )}
      </div>
    </div>
  );
}
