import React, { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { useSelector, useDispatch} from "react-redux"
// import { getTours } from '../redux/features/tourSlice';
import { getTours, searchTourApi } from '../redux/api';
import { useQuery } from 'react-query';
import SingleCard from '../components/SingleCard';
import { useLocation } from 'react-router-dom';


const Home = () => {
  // const dispatch = useDispatch();
  const [ isSearch, setIsSearch ] = useState(false)
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('searchQuery');
  // console.log(searchQuery);
  //  const tourss = useSelector( state => state?.tour?.tours?.allTours);
  //  console.log(tourss);

  // useEffect(() => {
  //   dispatch(getTours())
  // }, [])

  const { isLoading: isLoadingSearch, isError: isErrorSearch, data: searchData, error: searchError } = useQuery(["search", searchQuery], () => searchQuery ?  searchTourApi(searchQuery) : null, { onSuccess: () => {
    if(searchQuery) setIsSearch(true);
  }} );
  // console.log(searchData);
  const searchedTour = searchData?.data;
  // console.log(searchQuery);
  // console.log(isSearch);


  const { isLoading, isError, data, error } = useQuery('tours',  getTours);
  const tours = data?.data?.allTours;

  if (isLoading) {
    return <h1 className='mt-5'>Loading...</h1>
  }
  

  return (
    <>
      {isSearch ? (
        <>
          { isLoadingSearch && <h1>Loading.....</h1>}
          { searchedTour?.length === 0 ? (
            <h1>No data found</h1>
          ) : (
            <Box paddingX={8} paddingY={4} style={{margin: 'auto', marginTop: '4rem'}}>
              <Grid container spacing={4}>
                {searchedTour?.length > 0 &&  searchedTour.map((tour, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                    <SingleCard tour={tour} />
                  </Grid>
                ))}
              </Grid>
          </Box>
          )}
        </>
      ) : (
        <Box paddingX={8} paddingY={4} style={{margin: 'auto', marginTop: '4rem'}}>
          <Grid container spacing={4}>
            {tours?.length > 0 && tours.map((tour, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <SingleCard tour={tour} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  )
}

export default Home