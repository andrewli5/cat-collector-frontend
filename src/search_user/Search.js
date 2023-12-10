import React, { useState } from "react";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { getUserByUsername } from "../client";

const SearchUser = () => {
    const [username, setUsername] = useState("find user...");
    const navigate = useNavigate();
    let disable_click = false
    const handleKeyPress = async (event) => {
        if (event.key === "Enter") {
            disable_click = true;
            const userExists = await getUserByUsername(username);
            if (userExists === null) {
                setUsername("user does not exist :(");
            } else {
                navigate(`/profile/${username}`);
                setUsername("user found!");
            }
        }
    };

    const handleFocus = () => {
        if ((username === "find user...") || (username === "user does not exist :(") || (username === "user found!")) {
            setUsername("");
        }
    };

    const textFieldWidth = (username.length * 10)  
    return (
        <div>
            <TextField
                sx={{
                    border: "0",
                }}
                rows={1}
                size="small"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleFocus}
                type={"standard"}
                margin="dense"
                InputProps={{
                    style: {
                        fontSize: "21px",
                        color: "secondary",
                        width: `${textFieldWidth}px`,
                        minWidth: "120px",
                        maxWidth: "300px",
                    },
                    disabled: disable_click 
                }}
            />
        </div>
    );
    };
    export default SearchUser;