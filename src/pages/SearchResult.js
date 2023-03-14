import React, { useEffect } from 'react'
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { useSelector, useDispatch} from "react-redux"
// import { getTours } from '../redux/features/tourSlice';
import { searchTourApi } from '../redux/api';
import { useQuery } from 'react-query';
import SingleCard from '../components/SingleCard';
import { useParams, useLocation  } from 'react-router-dom';

const SearchResult = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('searchQuery');
    console.log(searchQuery);
    const { isLoading, isError, data, error } = useQuery(
        ["search", searchQuery],
        () => searchTourApi(searchQuery)
      );
      console.log(data);
    const searchedTour = data?.data;

    // if(searchedTour.length === 0) return <h1>No data</h1>

    if (isLoading) {
        return <h1 className='mt-5'>Loading...</h1>
    };

  return (
    <>
    <Box paddingX={8} paddingY={4} style={{margin: 'auto', marginTop: '4rem'}}>
      <Grid container spacing={4}>
         { searchedTour.length > 0 && searchedTour.map( (tour, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <SingleCard tour={tour} />
          </Grid>

         ))}
      </Grid>
    </Box>
    </>
  )
}

export default SearchResult