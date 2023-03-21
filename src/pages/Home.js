import React, { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { useSelector, useDispatch} from "react-redux"
// import { getTours } from '../redux/features/tourSlice';
import { getTours, searchTourApi } from '../redux/api';
import { useQuery } from 'react-query';
import SingleCard from '../components/SingleCard';
import Pagination from '@mui/material/Pagination';
import { useLocation, useNavigate } from 'react-router-dom';


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
  console.log(tours)
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

  
  if (isLoading) {
    return <h1 className='mt-5'>Loading...</h1>
  }

  if (isLoadingSearch) {
    return <h1 className='mt-5'>Loading...</h1>
  }
  

  return (
    <>
      {isSearch ? (
        <>
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
        <>
         <Box paddingX={8} paddingY={4} style={{margin: 'auto', marginTop: '4rem'}}>
          <Grid container spacing={4}>
            {tours?.length > 0 && tours.map((tour, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <SingleCard tour={tour} />
              </Grid>
            ))}
          </Grid>
         <Pagination variant='outlined' count={totalPages} page={parseInt(page)} onChange={handleChange} color="secondary" sx={{ mt: 5}} />
        </Box>
        </>
      )}
    </>
  )
}

export default Home