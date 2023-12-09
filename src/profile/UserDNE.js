import React from 'react';
import { Typography } from "@mui/material";
const UserDNE = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
            <div>
                <Typography variant="h1" style={{ color: 'gray' }}>user does not exist</Typography>
                <Typography variant="h5">sorry, the user you are looking for does not exist.</Typography>
            </div>
        </div>
    );
};

export default UserDNE;
