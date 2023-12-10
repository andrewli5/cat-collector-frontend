import { useParams } from "react-router-dom";
import { Alert, Pagination, Snackbar, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import {
  APP_NAME,
  CAT_API_KEY,
  CAT_API_URL_BREEDS,
  CAT_API_URL_IMAGE,
} from "../constants";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import EmptySearch from "./EmptySearch";
import { LoadingSearch } from "./LoadingSearch";
import * as React from "react";

const TEST_CAT_1 = "Test cat 1";
const TEST_CAT_2 = "Cattest 2";
const TEST_CAT_3 = "3 cat test";

const TEST_MATCHES = [
  { name: TEST_CAT_1, id: 1 },
  { name: TEST_CAT_2, id: 2 },
  { name: TEST_CAT_3, id: 3 },
];

const TEST_URLS = [
  {
    url: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-domestic-cat-mjf-1540-382ba2.jpg",
    name: TEST_CAT_1,
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYP55BSa-Dh55_qjvMei2v8uMPukL4skwNGre2nZQpj4T-pcsT",
    name: TEST_CAT_2,
  },
  {
    url: "https://www.catster.com/wp-content/uploads/2018/03/Calico-cat.jpg",
    name: TEST_CAT_3,
  },
];

const LOADING_STR = "LOADING";
const RESULTS_PER_PAGE = 8;

export default function Search() {
  const [matches, setMatches] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [warning, setWarning] = useState(false);

  const params = useParams();
  const query = params.query;

  const handleChange = (event, value) => {
    setIsLoading(true);
    setPage(value);
  };

  const isMatch = (query, breed) => {
    return breed.toLowerCase().includes(query.toLowerCase());
  };

  useEffect(() => {
    setIsLoading(true);
    async function getBreeds(retries = 2) {
      try {
        const response = await fetch(CAT_API_URL_BREEDS, {
          headers: {
            "x-api-key": CAT_API_KEY,
          },
        });
        const data = await response.json();
        setBreeds(data);
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          getBreeds((retries -= 1));
        } else {
          setWarning(true);
          setIsLoading(false);
        }
      }
    }

    getBreeds();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    document.title = query + " | " + APP_NAME;
    async function getMatches() {
      const newMatches = [];
      for (const breed of breeds) {
        if (isMatch(query, breed["name"])) {
          newMatches.push({
            name: breed["name"],
            id: breed["id"],
          });
        }
      }
      setMatches(newMatches);
    }

    if (query.toLowerCase() === "test") {
      setMatches(TEST_MATCHES);
      setBreeds(TEST_MATCHES);
    } else if (breeds.length !== 0) {
      getMatches();
    }
  }, [query, breeds]);

  useEffect(() => {
    async function getMatchImageUrls(retries = 2) {
      var imageUrls = [];
      if (query.toLowerCase() === "test") {
        imageUrls = TEST_URLS;
      } else {
        try {
          await Promise.all(
            matches
              .slice(
                RESULTS_PER_PAGE * page - RESULTS_PER_PAGE,
                RESULTS_PER_PAGE * page,
              )
              .map(async (match) => {
                await new Promise((resolve) => setTimeout(resolve, 500));
                const response = await fetch(CAT_API_URL_IMAGE + match["id"], {
                  headers: {
                    "x-api-key": CAT_API_KEY,
                  },
                });
                const data = await response.json();
                imageUrls.push(
                  data.length === 0 || data[0]["url"] === undefined
                    ? {
                        url: "",
                        name: match["name"],
                        id: match["id"],
                      }
                    : {
                        url: data[0]["url"],
                        name: match["name"],
                        id: match["id"],
                      },
                );
              }),
          );
        } catch (error) {
          if (retries > 0) {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            getMatchImageUrls((retries -= 1));
          } else {
            setWarning(true);
            setIsLoading(false);
          }
        }
      }
      setImageUrls(imageUrls);
      setIsLoading(false);
      return imageUrls;
    }

    if (!matches.includes(LOADING_STR) && breeds.length !== 0) {
      getMatchImageUrls();
    }
  }, [matches, page]);

  return (
    <>
      <Typography variant="h4" textAlign="center">
        results for: {query}
      </Typography>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
          }}
        >
          <LoadingSearch />
        </div>
      ) : matches.length === 0 && !isLoading && !warning ? (
        <EmptySearch />
      ) : !warning ? (
        <>
          {" "}
          <Grid container spacing={2} sx={{ marginTop: 1, marginLeft: 2 }}>
            {imageUrls.map((image, index) => (
              <Grid
                display="flex"
                flexDirection="column"
                alignItems="center"
                item
                xs={6}
                sm={4}
                md={2.5}
                key={index}
                sx={{ marginBottom: 3, marginLeft: 3, paddingLeft: 2 }}
              >
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  href={`/details/${image["id"]}`}
                >
                  <img
                    src={image["url"]}
                    width={"200px"}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      height: "200px",
                      borderRadius: "10px",
                      border: "2px solid white",
                    }}
                    alt={image["id"]}
                  />
                  <Typography variant="h5" textAlign="center" noWrap>
                    {image["name"].toLowerCase()}
                  </Typography>
                </Link>
              </Grid>
            ))}
          </Grid>
          {
            <Pagination
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 3,
              }}
              size="large"
              count={Math.ceil(matches.length / RESULTS_PER_PAGE)}
              page={page}
              onChange={handleChange}
            ></Pagination>
          }
        </>
      ) : (
        <Snackbar
          open={warning}
          autoHideDuration={5000}
          onClose={() => setWarning(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setWarning(false)}
            severity="warning"
            sx={{ width: "100%" }}
          >
            An error occurred during the search. Please try again later.
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
