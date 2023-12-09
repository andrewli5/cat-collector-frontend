import React, { useState } from "react";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { getUserByUsername } from "../client";

const SearchUser = () => {
    const [username, setUsername] = useState("find user...");
    const navigate = useNavigate();
    const handleKeyPress = async (event) => {
        
        if (event.key === "Enter") {
            const userExists = await getUserByUsername(username);
            if (userExists === null) {
                setUsername("user does not exist :(");
            } else {
                navigate(`/profile/${username}`);
            }
        }
    };

    const handleFocus = () => {
        if ((username === "find user...") || (username === "user does not exist :(")) {
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
                }}
            />
        </div>
    );
};
export default SearchUser;
