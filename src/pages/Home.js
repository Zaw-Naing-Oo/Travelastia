import React, { useEffect } from 'react'
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { useSelector, useDispatch} from "react-redux"
// import { getTours } from '../redux/features/tourSlice';
import { getTours } from '../redux/api';
import { useQuery } from 'react-query';
import SingleCard from '../components/SingleCard';


const Home = () => {
  const dispatch = useDispatch();
  //  const tourss = useSelector( state => state?.tour?.tours?.allTours);
  //  console.log(tourss);

  // useEffect(() => {
  //   dispatch(getTours())
  // }, [])


  const { isLoading, isError, data, error } = useQuery('tours',  getTours);
  const tours = data?.data?.allTours;
  console.log(tours) 
//   const base64Data = Buffer.from(tours[0].image).toString('base64');
// console.log(base64Data);

  if (isLoading) {
    return <h1 className='mt-5'>Loading...</h1>
  }

//   if (isError) {
//     return <span>Error: {error.message}</span>
//   }
  

  return (
    <>
    <Box paddingX={8} paddingY={4} style={{margin: 'auto', marginTop: '4rem'}}>
      <Grid container spacing={4}>
         { tours.length > 0 && tours.map( (tour, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <SingleCard tour={tour} />
          </Grid>

         ))}
      </Grid>
    </Box>
    </>
  )
}

export default Home