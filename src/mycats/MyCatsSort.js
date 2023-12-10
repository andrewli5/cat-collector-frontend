import { useState } from "react";
import { Typography, Link, Box, Button, Menu, MenuItem } from "@mui/material";
import "../css/styles.css";
import SortIcon from "@mui/icons-material/Sort";
import { styled, alpha } from "@mui/material/styles";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

export function MyCatsSort() {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilter = (filter) => {
    console.log(filter);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.secondary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  return (
    <Box alignItems={"center"} display={"flex"} justifyContent={"right"}>
      <Button
        height={50}
        id="filter-button"
        aria-controls={menuOpen ? "filter-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
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
      >
        Sort
      </Button>
      <StyledMenu
        MenuListProps={{
          "aria-labelledby": "filter-button",
        }}
        anchorEl={anchorEl}
        id="filter-menu"
        aria-labelledby="filter-button"
        open={menuOpen}
        onClose={handleClose}
      >
        <MenuItem
          variant="contained"
          onClick={() => handleFilter("name")}
        >
          {"Name"}
        </MenuItem>
        <MenuItem
          variant="contained"
          onClick={() => handleFilter("rarity")}
        >
          {"Rarity"}
        </MenuItem>
        <MenuItem
          variant="contained"
          onClick={() => handleFilter("owned")}
        >
          {"Owned"}
        </MenuItem>
      </StyledMenu>
      <Button sx={{ marginLeft: "8px" }} variant="contained" color="primary">
        <SyncAltIcon sx={{ color: "white", transform: "rotate(90deg)" }} />
      </Button>
    </Box>
  );
}
