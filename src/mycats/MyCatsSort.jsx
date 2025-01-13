import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import "../css/styles.css";
import SortIcon from "@mui/icons-material/Sort";
import { styled, alpha } from "@mui/material/styles";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { getCurrentUser } from "../client";

export function MyCatsSort({
  sortFunction,
  reverseFunction,
  showOwnedOnly,
  setShowOwnedOnly,
}) {
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const sortMenuOpen = Boolean(sortAnchorEl);
  const [sortText, setSortText] = useState("");

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSort = (sort) => {
    sortFunction(sort);
    setSortText(sort);
    setSortAnchorEl(null);
  };

  const handleReverse = () => {
    reverseFunction();
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleCheckboxClick = () => {
    setShowOwnedOnly(!showOwnedOnly);
  };

  const ShowOwnedCheckbox = () => {
    if (getCurrentUser()) {
      return (
        <Checkbox
          onClick={handleCheckboxClick}
          style={{ color: "white" }}
          checked={showOwnedOnly}
        />
      );
    } else {
      return (
        <Checkbox
          disabled
          onClick={handleCheckboxClick}
          style={{ color: "white" }}
          checked={true}
        />
      );
    }
  };

  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      color: "white",
      marginTop: "5px",
      backgroundColor: "#735290",
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: 0,
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.secondary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));

  return (
    <Box alignItems={"center"} display={"flex"} justifyContent={"right"}>
      <FormControlLabel
        sx={{
          height: "36px",
          borderRadius: "4px",
          color: "white",
          paddingRight: "8px",
        }}
        control={<ShowOwnedCheckbox />}
        label={<Typography variant="h5">{"only show cats i own"}</Typography>}
      />
      <Button
        id="sort-button"
        aria-controls={sortMenuOpen ? "sort-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={sortMenuOpen ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleSortClick}
        endIcon={
          <SortIcon
            sx={{
              color: "white",
              display: "flex",
              textAlign: "right",
              justifyContent: "right",
              alignItems: "right",
            }}
          />
        }
        sx={{ height: "36px" }} // Add this line to set the height
      >
        {sortText !== "" ? sortText : "sort"}
      </Button>
      <StyledMenu
        id="sort-menu"
        MenuListProps={{
          "aria-labelledby": "sort-button",
        }}
        anchorEl={sortAnchorEl}
        aria-labelledby="sort-button"
        open={sortMenuOpen}
        onClose={handleSortClose}
      >
        <MenuItem variant="contained" onClick={() => handleSort("name")}>
          {"name"}
        </MenuItem>
        <MenuItem variant="contained" onClick={() => handleSort("rarity")}>
          {"rarity"}
        </MenuItem>
        <MenuItem variant="contained" onClick={() => handleSort("owned")}>
          {"owned"}
        </MenuItem>
      </StyledMenu>
      <Button
        onClick={handleReverse}
        sx={{
          marginLeft: "8px",
          height: "36px",
          minWidth: "10px",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
        variant="contained"
        color="primary"
        disableElevation
      >
        <SyncAltIcon
          sx={{
            paddingLeft: "0px",
            fontSize: "medium",
            color: "white",
            transform: "rotate(90deg)",
          }}
        />
      </Button>
    </Box>
  );
}
