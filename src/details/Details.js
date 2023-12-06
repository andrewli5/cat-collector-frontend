import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { CAT_API_KEY, CAT_API_URL_BREEDS, CAT_API_URL_IMAGE, CAT_API_URL_IMAGES } from "../constants";
import { Grid } from "@mui/material";
import { importAll } from "../utils/importAll";
import Heart from "../assets/heart_icon.png";
import Star from "../assets/star_icon.png";
import "../css/styles.css";

export default function Details() {
    const [breedData, setBreedData] = useState(''); 
    const [imageUrls, setImageUrls] = useState([]);
    const [imageIdx, setImageIdx] = useState(0);
    const [catIcon, setCatIcon] = useState('');
    const [owned, setOwned] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const params = useParams();
    const id = params.id;
    const catIcons = importAll(
        require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
      );
    

    useEffect(() => {
        async function getBreedData() {
            const response = await fetch(CAT_API_URL_BREEDS, {
            headers: {
                "x-api-key": CAT_API_KEY,
            },
            });
            const data = await response.json();
            const currentBreed = data.find((breed) => breed.id === id);
            setBreedData(currentBreed);
        }

        getBreedData();
    }, []);

    useEffect(() => {
        async function getImageURLS() { 
            const urls = []
            const response = await fetch(CAT_API_URL_IMAGES.replace("{}", id), {
                headers: {
                    "x-api-key": CAT_API_KEY,
                },
            });
            const data = await response.json();
            for (const datum of data) {
                urls.push(datum['url']);
            }
            setImageUrls(urls);
        }

        getImageURLS();
    }, [])
    
    useEffect(() => {
        const catIconName = breedData.name === undefined ? '' : breedData.name.toLowerCase().replace(" ", "_") + ".png";
        console.log("catIconName: " + catIconName)
        setCatIcon(catIconName)
    }, [breedData])
    
    function nextImage() {
        setImageIdx((imageIdx + 1) % imageUrls.length);
    }

    function toggleIcon() {
        setFavorite(!favorite);
    }

    return (
        <div>
            <Grid container spacing={2} maxHeight='lg' maxWidth='lg' sx={{marginTop: 2}}>
                <Grid style={{paddingLeft: '70px'}}item xs={4} sm={5} md={6}>
                    <img 
                        src={imageUrls[imageIdx]}
                        width={400}
                        height={400}
                        style={{
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: "10px",
                            border: "2px solid white",
                        }}
                        onClick={nextImage}
                        alt={`display`}/>
                </Grid>
                <Grid item xs={10} sm={8} md={6}>
                    <h1 style={{margin: '0px', marginBottom: '20px'}}> {breedData.name} 
                    <span title="Owned" >
                        <img className={owned ? "detailsIcon hover" : "detailsIcon hover inactive"} src={Star} width={30} height={30} alt={`star`}/>
                    </span>
                    <span title="Favorite">
                        <img className={favorite ? "detailsIcon hover" : "detailsIcon hover inactive"} src={Heart} width={32} height={32} alt={`heart`} onClick={toggleIcon}/>
                    </span>
                    <span style={{float: "right"}}> <img style={{float: "right"}} src={catIcons[catIcon]} width={60} height={60} alt={`icon`}/> </span>
                    </h1>
                    
                    <h3 style={{margin: 0}}> Rarity: </h3>
                    <hr></hr>
                    <span style={{fontSize: "18px", fontWeight: "bold"}}> Origin: </span> 
                    <span style={{float: "right"}}> {breedData.origin}</span>
                    <br></br>
                    <span style={{fontSize: "18px", fontWeight: 'bold'}}> Weight: </span> 
                    <span style={{float: "right"}}> {breedData.weight.imperial} lbs </span>
                    <br></br>
                    <span style={{fontSize: "18px", fontWeight: 'bold'}}> Temperament: </span> 
                    <span style={{float: "right"}}> {breedData.temperament} </span>
                    <br></br>
                    <br></br>
                    <span style={{fontSize: "18px", fontWeight: 'bold'}}> Adaptability: </span> 
                    {[...Array(breedData.adaptability)].map((e, i) => 
                    <span style={{float: "right"}}>
                        <img src={Star} width={17} height={17}/>
                    </span>)}                    <br></br>
                    <span style={{fontSize: "18px", fontWeight: 'bold'}}> Affection: </span> 
                    {[...Array(breedData.affection_level)].map((e, i) => 
                    <span style={{float: "right"}}>
                        <img src={Star} width={17} height={17}/>
                    </span>)}                    <br></br>
                    <span style={{fontSize: "18px", fontWeight: 'bold'}}> Energy: </span> 
                    {[...Array(breedData.energy_level)].map((e, i) => 
                    <span style={{float: "right"}}>
                        <img src={Star} width={17} height={17}/>
                    </span>)}
                    <br></br>
                    <span style={{fontSize: "18px", fontWeight: 'bold'}}> Intelligence: </span> 
                    {[...Array(breedData.intelligence)].map((e, i) => 
                    <span style={{float: "right"}}>
                        <img src={Star} width={17} height={17}/>
                    </span>)}                    <br></br>
                    <br></br>
                    <span style={{fontSize: "19px"}}> {breedData.description} </span>

                </Grid>
            </Grid>
        </div>
    )
}