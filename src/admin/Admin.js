import {
  Grid,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  TextField,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { APP_NAME } from "../constants";
import { getCurrentUser } from "../client";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import * as client from "../client";
import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import EditableText from "../reusable/EditableText";
import { LoadingButton } from "@mui/lab";
import SearchIcon from "@mui/icons-material/Search";
import JumpingCat from "../assets/gifs/jumping_cat.gif";
import Coin from "../assets/coin_icon.png";
import { generateErrorMessage } from "../utils/utils";

export default function Admin() {
  const navigate = useNavigate();
  const [saveLoading, setSaveLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [queriedUsers, setQueriedUsers] = useState([]);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [userBeingEdited, setUserBeingEdited] = useState({});
  const [mobileUserBeingEdited, setMobileUserBeingEdited] = useState({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    const newQueriedUsers = users.filter((user) => {
      return (
        user.username.toLowerCase().includes(query.toLowerCase().trim()) ||
        user.firstName.toLowerCase().includes(query.toLowerCase().trim()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase().trim()) ||
        user.role.toLowerCase().includes(query.toLowerCase().trim()) ||
        user.coins.toString().toLowerCase().includes(query.toLowerCase().trim())
      );
    });
    setQueriedUsers(newQueriedUsers);
  }, [query]);

  useEffect(() => {
    document.title = "admin tools | " + APP_NAME;
    if (!getCurrentUser()) {
      navigate("/signin");
    } else if (getCurrentUser().role !== "ADMIN") {
      navigate("/forbidden");
    } else {
      setUsersLoading(true);
      fetchAllUsers();
    }
  }, []);

  const handleFieldEdited = (field, value, mobile = false) => {
    if (field === "coins") {
      value = parseInt(value);
    }
    if (mobile) {
      setMobileUserBeingEdited({ ...mobileUserBeingEdited, [field]: value });
    } else {
      setUserBeingEdited({ ...userBeingEdited, [field]: value });
    }
  };

  const handleSave = async () => {
    const user = mobileUserBeingEdited._id
      ? mobileUserBeingEdited
      : userBeingEdited;

    // users cannot edit their own role
    if (
      getCurrentUser()._id === user._id &&
      getCurrentUser().role !== user.role
    ) {
      setError(true);
      setErrorMessage("cannot edit your own role.");
      return;
    }

    try {
      setSaveLoading(true);
      const _ = await client.updateUserByUserId(user._id, {
        ...user,
      });

      setSuccess(true);
      setTimeout(() => {
        setSaveLoading(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      if (error.response) {
        const errorMessage = generateErrorMessage(
          error.response.data.message,
          user.username,
        );
        setError(true);
        setErrorMessage(errorMessage);
      }
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setMobileUserBeingEdited({});
    setUserBeingEdited({});
  };

  const fetchAllUsers = async () => {
    try {
      const fetchedUsers = await client.getAllUsers();
      setUsers([...fetchedUsers]);
      setQueriedUsers([...fetchedUsers]);
      setTimeout(() => {
        setUsersLoading(false);
      }, 500);
    } catch {
      setError(true);
      setErrorMessage("error fetching users.");
      setUsersLoading(false);
    }
  };

  if (!getCurrentUser()) {
    return null;
  }

  return (
    <>
      <NotificationSnackbar
        open={success}
        setOpen={setSuccess}
        severity="success"
        message="successfully saved! reloading..."
        autoHideDuration={3000}
      />
      <NotificationSnackbar
        open={error}
        setOpen={setError}
        severity="error"
        message={errorMessage.toLowerCase()}
        autoHideDuration={3000}
      />
      <Typography
        variant="h3"
        color="white"
        textAlign="center"
        marginBottom={2}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        {"admin tools"}
        <TextField
          size="small"
          label="search by any field..."
          fullWidth
          sx={{ maxWidth: "300px" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="quintenary" />
              </InputAdornment>
            ),
          }}
        />
      </Typography>
      <Box display="flex" justifyContent="center">
        <Grid
          container
          rowSpacing={3}
          sx={{
            marginBottom: "30px",
            maxWidth: "1200px",
            paddingLeft: 3,
            paddingRight: 3,
          }}
        >
          <UserRowHeaders />
          <Grid item xs={12}>
            <Divider flexItem />
          </Grid>
          {usersLoading ? (
            <Box
              sx={{
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img src={JumpingCat} />
              <Typography variant="h4" sx={{ marginTop: "10px" }}>
                Loading...
              </Typography>
            </Box>
          ) : (
            queriedUsers.map((user) => (
              <EditableUserRow
                loading={saveLoading}
                edit={user._id === userBeingEdited._id}
                key={user._id}
                user={user}
                userBeingEdited={userBeingEdited}
                setUserBeingEdited={setUserBeingEdited}
                mobileUserBeingEdited={mobileUserBeingEdited}
                setMobileUserBeingEdited={setMobileUserBeingEdited}
                handleFieldEdited={handleFieldEdited}
                handleSave={() => handleSave(user._id)}
                handleCancel={handleCancel}
                emphasized={user._id === getCurrentUser()._id}
              />
            ))
          )}
        </Grid>
      </Box>
    </>
  );
}

function EditUserMobileMenu({
  user,
  mobileUserBeingEdited,
  openMobileMenu,
  setOpenMobileMenu,
  handleFieldEdited,
  handleSave,
  emphasized,
}) {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={openMobileMenu}
    >
      <Grid
        container
        direction="column"
        spacing={1}
        key={user._id}
        sx={{
          border: "1px solid white",
          borderRadius: "10px",
          backgroundColor: "secondary.main",
          paddingLeft: 2,
          paddingRight: 3,
          maxWidth: "50vh",
          maxHeight: "80vh",
        }}
      >
        <Grid item>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
            }}
          >
            Edit User
          </Typography>
        </Grid>
        <Grid item>
          <EditableText
            edit={openMobileMenu}
            emphasized={emphasized}
            small
            label="username"
            value={mobileUserBeingEdited.username}
            onChange={(event) => {
              handleFieldEdited("username", event.target.value, true);
            }}
          />
        </Grid>
        <Grid item>
          <EditableText
            edit={openMobileMenu}
            emphasized={emphasized}
            small
            label="first name"
            value={mobileUserBeingEdited.firstName}
            onChange={(event) => {
              handleFieldEdited("firstName", event.target.value, true);
            }}
          />
        </Grid>
        <Grid item>
          <EditableText
            edit={openMobileMenu}
            emphasized={emphasized}
            small
            label="last name"
            value={mobileUserBeingEdited.lastName}
            onChange={(event) => {
              handleFieldEdited("lastName", event.target.value, true);
            }}
          />
        </Grid>
        <Grid item>
          <EditableText
            edit={openMobileMenu}
            emphasized={emphasized}
            small
            select
            value={mobileUserBeingEdited.role}
            label="role"
            menuItems={[
              { value: "ADMIN", text: "admin" },
              { value: "USER", text: "user" },
            ]}
            onChange={(event) => {
              handleFieldEdited("role", event.target.value, true);
            }}
          />
        </Grid>
        <Grid item>
          <EditableText
            edit={openMobileMenu}
            emphasized={emphasized}
            small
            label="coins"
            value={
              user._id === mobileUserBeingEdited._id
                ? mobileUserBeingEdited.coins
                : user.coins
            }
            onChange={(event) => {
              handleFieldEdited("coins", event.target.value, true);
            }}
            type="number"
          />
        </Grid>
        <Grid item>
          <Box component="div" sx={{ marginBottom: 1 }}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                handleSave();
              }}
              sx={{
                width: "fit-content",
                marginRight: 1,
              }}
            >
              save
            </Button>
            <Button
              color="white"
              variant="outlined"
              onClick={() => {
                setOpenMobileMenu(false);
              }}
              sx={{ width: "fit-content" }}
            >
              cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Backdrop>
  );
}

function EditUser({
  edit,
  loading,
  user,
  userBeingEdited,
  setUserBeingEdited,
  setMobileUserBeingEdited,
  handleFieldEdited,
  handleSave,
  handleCancel,
  emphasized,
  isMobileScreen,
  setOpenMobileMenu,
}) {
  return (
    <>
      <Grid item xs={2}>
        <EditableText
          edit={edit}
          emphasized={emphasized}
          fullWidth
          small
          label="username"
          value={
            user._id === userBeingEdited._id
              ? userBeingEdited.username
              : user.username
          }
          onChange={(event) => {
            handleFieldEdited("username", event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={2.5}>
        <EditableText
          edit={edit}
          emphasized={emphasized}
          fullWidth
          small
          label="first name"
          value={
            user._id === userBeingEdited._id
              ? userBeingEdited.firstName
              : user.firstName
          }
          onChange={(event) => {
            handleFieldEdited("firstName", event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={2.5}>
        <EditableText
          edit={edit}
          emphasized={emphasized}
          fullWidth
          small
          label="last name"
          value={
            user._id === userBeingEdited._id
              ? userBeingEdited.lastName
              : user.lastName
          }
          onChange={(event) => {
            handleFieldEdited("lastName", event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={1.5}>
        <EditableText
          edit={edit}
          emphasized={emphasized}
          small
          select
          fullWidth
          value={
            user._id === userBeingEdited._id
              ? userBeingEdited.role
              : user.role.toLowerCase()
          }
          label="role"
          menuItems={[
            { value: "ADMIN", text: "admin" },
            { value: "USER", text: "user" },
          ]}
          onChange={(event) => {
            handleFieldEdited("role", event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={1.5}>
        <EditableText
          edit={edit}
          emphasized={emphasized}
          small
          fullWidth
          label="coins"
          value={
            user._id === userBeingEdited._id
              ? userBeingEdited.coins
              : user.coins
          }
          onChange={(event) => {
            handleFieldEdited("coins", event.target.value);
          }}
          type="number"
        />
      </Grid>
      <Grid item xs={1.5} textAlign="center">
        {!userBeingEdited._id || userBeingEdited._id !== user._id ? (
          <IconButton
            color="quintenary"
            onClick={() => {
              if (isMobileScreen) {
                setOpenMobileMenu(true);
                setMobileUserBeingEdited({ ...user });
              } else {
                setUserBeingEdited({ ...user });
              }
            }}
          >
            <EditIcon />
          </IconButton>
        ) : (
          <Box display="flex" flexDirection="row">
            <LoadingButton
              loading={loading}
              color="primary"
              variant="contained"
              onClick={handleSave}
              sx={{ marginRight: 2 }}
            >
              save
            </LoadingButton>
            <Button
              color="quintenary"
              variant="contained"
              onClick={handleCancel}
            >
              cancel
            </Button>
          </Box>
        )}
      </Grid>
    </>
  );
}

function EditableUserRow({
  user,
  mobileUserBeingEdited,
  handleFieldEdited,
  handleSave,
  emphasized,
}) {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  return (
    <Grid container columnSpacing={3} item key={user._id} xs={12}>
      <EditUser
        {...arguments[0]}
        emphasized={isMobileScreen ? false : emphasized}
        isMobileScreen={isMobileScreen}
        setOpenMobileMenu={setOpenMobileMenu}
      />
      <EditUserMobileMenu
        user={user}
        mobileUserBeingEdited={mobileUserBeingEdited}
        handleFieldEdited={handleFieldEdited}
        openMobileMenu={openMobileMenu}
        setOpenMobileMenu={setOpenMobileMenu}
        handleSave={handleSave}
        emphasized={emphasized}
        theme={theme}
      />
    </Grid>
  );
}

function UserRowHeaders() {
  return (
    <>
      <Grid
        container
        columnSpacing={3}
        item
        xs={12}
        textAlign="left"
        justifyContent="left"
      >
        <Grid item xs={2}>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold" }}
            sx={{
              fontSize: { xs: "1em", sm: "1.5em", md: "2em" },
            }}
            xs={2}
          >
            username
          </Typography>
        </Grid>
        <Grid item xs={2.5}>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold" }}
            sx={{
              fontSize: { xs: "1em", sm: "1.5em", md: "2em" },
            }}
          >
            first name
          </Typography>
        </Grid>
        <Grid item xs={2.5}>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold" }}
            sx={{
              fontSize: { xs: "1em", sm: "1.5em", md: "2em" },
            }}
          >
            last name
          </Typography>
        </Grid>
        <Grid item xs={1.5}>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold" }}
            sx={{
              fontSize: { xs: "1em", sm: "1.5em", md: "2em" },
            }}
          >
            role
          </Typography>
        </Grid>
        <Grid item xs={1.5}>
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            <Box
              component="img"
              display="flex"
              src={Coin}
              sx={{
                width: {
                  xs: "18px",
                  md: "30px",
                },
                height: {
                  xs: "18px",
                  md: "30px",
                },
              }}
            />
          </Typography>
        </Grid>
        <Grid item xs={1.5}>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold" }}
            sx={{
              fontSize: { xs: 0, sm: "1.5em", md: "2em" },
            }}
          >
            actions
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
