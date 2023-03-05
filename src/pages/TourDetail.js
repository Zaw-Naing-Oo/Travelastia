import React from 'react'
import { useParams } from 'react-router-dom'
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography  from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import Chip from '@mui/material/Chip'
import  Breadcrumbs  from '@mui/material/Breadcrumbs'
import Link from "@mui/material/Link"
import useMediaQuery from '@mui/material/useMediaQuery';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useTheme } from '@mui/material/styles';
import { useQuery } from 'react-query';
import { getTour } from '../redux/api';
import { useSelector } from 'react-redux'
import { Buffer } from 'buffer'
import moment from "moment"
import "moment-timezone"



const TourDetail = () => {
   const { id } = useParams();
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

   const { isLoading, isError, data, error } = useQuery('tour', () =>  getTour(id));
  const tour = data?.data?.tour;

    const tag =tour?.tags.join(",").split(",").map( (tag,index) => (
    <Chip key={index} label={ tag } color="primary" sx={{ margin: "0.3rem"}} />
  ))

   if (isLoading) {
    return <span>Loading...</span>
  }

  return (
    <>
     <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ fontSize: 17 ,marginTop: isMobile ? '5rem' : '7rem', marginLeft: isMobile ? '2rem' :'6rem', marginBottom: isMobile ? '1rem' : 0}}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary" sx={{ fontSize: 17 }}>Detail</Typography>
      </Breadcrumbs>
    <Box marginX="auto" textAlign="center" sx={{ paddingX : isMobile ? 4 : 10, paddingBottom : 6 }}>
       <Grid container>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0.5rem"}}>
            <CalendarMonthIcon sx={{ fontSize: 22}}/>
             <Typography variant='body2' className='text-black-50'>{ moment(tour?.createdAt).fromNow() }</Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center"}}>
             <Typography variant='h3' gutterBottom>{tour?.title }</Typography>
          </Grid>
          <Grid item sx={{ textAlign: "center", width: "100%", marginBottom: "1rem"}}>
            { tag }
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "left", paddingX: isMobile ? 0 : 17,}}>
             <Typography variant='h5' gutterBottom className='text-black-50'> Created By : {tour?.name }</Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", paddingX: isMobile ? 0 : 17, marginBottom: "1rem"}} boxShadow="none">
            <Card>
              <CardMedia
                sx={{ height: 400, objectFit: "cover" }}
                image={`data:${data?.data?.tour?.image?.contentType};base64,${Buffer.from(data?.data?.tour?.image?.data).toString('base64')}`}
                title={ tour?.title }
                />
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "left", paddingX: isMobile ? 0 : 18 }}>
            <Typography variant='h5' gutterBottom>
            {tour?.description }
            </Typography>
          </Grid>
        </Grid>      
    </Box>
    </>
  )
}

export default TourDetail