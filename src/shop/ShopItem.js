import { Grid, Typography } from "@mui/material";

export default function ShopItem({icon, title, description, price}) {
    return(
        <>
            <Grid item xs={2} md={2}>
                <Typography>{icon}</Typography>
            </Grid>
            <Grid item xs={4} md={3}>
                <Typography>{title}</Typography>
            </Grid>
            <Grid item xs={4} md={5}>
            <Typography>{description}</Typography>
            </Grid>
            <Grid item xs={1} md={1}>
                <Typography>{price}</Typography>
            </Grid>
        </>
    )
}