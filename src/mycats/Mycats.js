import React from 'react'
import { Container } from "@mui/material";
import Grid from '@mui/material/Grid';
import NavBar from '../navbar/NavBar';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  };

export default function Mycats() {
    const catIcons = importAll(require.context('../assets/catIcons', false, /\.(png|jpe?g|svg)$/));

    return (
        <div>
            <NavBar />
            <h1>Collection</h1>
            <Container>
                <Grid container spacing={.5}>
                    {Object.keys(catIcons).map((catIcon, index) => {
                        const name = catIcon.replace('.png', '').replace('_', ' ');
                        return (
                            <Grid display="flex" flexDirection="column" alignItems="center" item xs={2} key={index}>
                                <img style={{WebkitFilter: 'grayscale(100%)'}} src={catIcons[catIcon]} width={60} height={60} alt={`image-${index}`} />
                                <div style={{textAlign: "center"}}> {name} </div>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </div>
    );
}