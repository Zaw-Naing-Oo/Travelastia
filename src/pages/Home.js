import React, { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import { getTours, searchTourApi } from '../redux/api';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from "lottie-react"
import * as nodatafound from "../images/nodatafound.json"

// components
import SingleCard from '../components/SingleCard';

// images
import whiteBg from "../images/whiteBg.jpg"


const Home = () => {
  const [ isSearch, setIsSearch ] = useState(false)
  const [ page, setPage ] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('searchQuery');
  const urlPage = new URLSearchParams(location.search).get('page') || 1;


  // for searched tour data
  const { isLoading: isLoadingSearch, isError: isErrorSearch, data: searchData, error: searchError } = useQuery(["search", searchQuery], () => searchQuery ?  searchTourApi(searchQuery) : null, { onSuccess: () => {
    if(searchQuery) setIsSearch(true);
  }});
  const searchedTour = searchData?.data;

  // For all Tours data
  const { isLoading, isError, data, error } = useQuery(['tours',page], () => getTours(page));
  const tours = data?.data?.allTours;
  const totalPages = data?.data?.totalPages;

  useEffect(() => {
    if (page !== parseInt(urlPage)) {
      setPage(parseInt(urlPage));
    }
  }, [page, urlPage]);

  const handleChange = (event, value) => {
     setPage(value);
     navigate(`/tours?page=${value}`);
  }  

  return (
    <>
      {isSearch ? (
        <>
          { searchedTour?.length === 0 ? (
            <Box sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: `url(${whiteBg})`,
            }}>
              <Lottie animationData={nodatafound} loop={true} autoplay />
            </Box>
          ) : (
            <Box paddingX={8} paddingY={5} sx={{margin: 'auto', background: `url(${whiteBg})`, backgroundPosition: "center", backgroundSize: "cover", minHeight: "100vh"}}>
              { isLoadingSearch ? (
                <Grid container spacing={4}>
                  {[...Array(8)].map((_, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                      <Skeleton variant="rounded" width={250} height={350} sx={{ borderRadius: "25px" }} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid container spacing={4}>
                  {searchedTour?.length > 0 &&  searchedTour.map((tour, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4} lg={3} position="relative">
                      <SingleCard tour={tour} />
                    </Grid>
                  ))}
                </Grid>
              )}
          </Box>
          )}
        </>
      ) : (
        <>
         <Box paddingX={8} paddingY={5} sx={{ margin: "auto", background: `url(${whiteBg})`, backgroundPosition: "center", backgroundSize: "cover", minHeight: "100vh" }}>
          { isLoading ? (
            <Grid container spacing={4}>
              {[...Array(8)].map((_, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                  <Skeleton variant="rounded" width={250} height={350} sx={{ borderRadius: "25px" }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={4}>
              {tours?.length > 0 && tours.map((tour, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                  <SingleCard tour={tour} />
                </Grid>
              ))}
            </Grid>
          )}
         <Pagination shape='rounded' count={totalPages} page={parseInt(page)} onChange={handleChange} sx={{ mt: 5, '& .MuiPagination-ul' : { justifyContent: "flex-end"},  '& .Mui-selected' : { color: "#000", background: "#4db6ac !important"} }} />
        </Box>
        </>
      )}
    </>
  )
}

export default Home