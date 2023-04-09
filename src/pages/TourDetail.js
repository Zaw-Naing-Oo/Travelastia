import React, { useState } from 'react'
import Grid from "@mui/material/Grid"
import Typography  from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import Chip from '@mui/material/Chip'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Link from "@mui/material/Link"
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams } from 'react-router-dom'
import { useTheme } from '@mui/material/styles';
import { useQuery, useMutation } from 'react-query';
import { getTour, createComment } from '../redux/api';
import { useSelector } from 'react-redux'
import { Buffer } from 'buffer'
import moment from "moment"
import "moment-timezone"

// icons
import SendIcon from '@mui/icons-material/Send';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import PendingIcon from '@mui/icons-material/Pending';

//images
import whiteBg from "../images/whiteBg.jpg"


const TourDetail = () => {
  const [comment, setComment] = useState('');
   const { id } = useParams();
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
   const user = useSelector( state => state?.auth?.user?.result);

   const { isLoading, isError, data, error } = useQuery('tour', () =>  getTour(id));
   const tour = data?.data?.tour;

   const createCommentMutation = useMutation((comment) => createComment(id, user, comment ));

    const tag =tour?.tags.join(",").split(",").map( (tag,index) => (
    <Chip key={index} label={ tag } sx={{ margin: "0.3rem", backgroundImage: "linear-gradient(to right, #26a69a, #1de9b6, #26a69a)", borderRadius: "5px"}} />
  ))

   if (isLoading) {
    return (
      <Box sx={{ paddingX : isMobile ? 4 : 4, paddingBottom : 6, marginTop: "4rem" }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width={ isMobile ? "50%" : "20%"} height={20} sx={{ margin: "auto",}} />
          <Skeleton variant="text" width={ isMobile ? "70%" : "25%"} height={20} sx={{ marginX: "auto !important", marginY: 2}} />
          <Skeleton variant="text" width="10%" height={20} sx={{ marginX: "auto !important",}} />
          <Skeleton variant="text" width="100%" height={300} sx={{ marginX: "auto", marginTop: "0 !important",}} />
          <Skeleton variant="text" width="100%" height={80} sx={{ marginX: "auto", }} />
        </Stack>
        <Stack spacing={3}>
          <Skeleton variant="text" width={ isMobile ? "50%" : "20%"} height={20} />
          <Skeleton variant="text" width={ isMobile ? "50%" : "20%"} height={20} />
          <Skeleton variant="text" width={ isMobile ? "50%" : "20%"} height={20} />
          <Skeleton variant="text" width={ isMobile ? "50%" : "20%"} height={20} />
        </Stack>
      </Box>
    )
  }

  const handleComment = (e) => {
    e.preventDefault();
    createCommentMutation.mutate(comment);
    setComment('');
  }

  return (
    <Box sx={{ background: "red", paddingY: 3, background: `url(${whiteBg})`, backgroundPosition: "center", backgroundSize: "cover",}}>
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ fontSize: 17 , marginLeft: isMobile ? '2rem' :'6rem', marginBottom: isMobile ? '1rem' : 0}}>
        <Link color="inherit" href='/' sx={{ textDecoration: "none", cursor: "pointer", '&:hover': { color: "#64ffda"},}} >
          Back
        </Link>
        <Typography color="text.primary" sx={{ fontSize: 17 }}>Detail</Typography>
      </Breadcrumbs>

      <Box textAlign="center" sx={{ paddingX : isMobile ? 4 : 4, paddingBottom : 6, marginTop: "2rem" }}>
        <Grid container>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingX: isMobile ? 0 : 18, marginBottom: "0.5rem"}}>
              <CalendarMonthIcon sx={{ fontSize: 22, marginRight: "10px"}}/>
              <Typography variant='body2' className='text-black-50'>{ moment(tour?.createdAt).fromNow() }</Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center",}}>
            <Typography variant='h1' gutterBottom sx={{ fontWeight: 600}}>{tour?.title }</Typography>
          </Grid>
          <Grid item sx={{ textAlign: "center", width: "100%", marginBottom: "1rem"}}>
            { tag }
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", paddingX: isMobile ? 0 : 13, marginBottom: "1rem"}} boxShadow="none">
            <Card>
              <CardMedia
                sx={{ height: isMobile ? 400 : 500, objectFit: "cover" }}
                image={`data:${data?.data?.tour?.image?.contentType};base64,${Buffer.from(data?.data?.tour?.image?.data).toString('base64')}`}
                title={ tour?.title }
                />
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "left", paddingX: isMobile ? 0 : 15 }}>
            <Typography variant='h5' gutterBottom>
            {tour?.description }
            </Typography>
          </Grid>

          {/* Comment input */}
          { user && (
            <Box component="form" onSubmit={handleComment} sx={{ marginY: isMobile ? "1.5rem" : "2rem", paddingX: "1rem", paddingY: "0.5rem", width: isMobile ? "100%" : "80%", marginX: "auto", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",}}>
              <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginX: "auto"}}>
                <input 
                  placeholder='Leave Comment' 
                  value={comment}
                  onChange={ e => setComment(e.target.value)}
                  style={{ border: "none", outline: "none", background: "none"}} 
                />
                <Button 
                type='submit' 
                variant="contained" 
                size='small' 
                endIcon={ createCommentMutation.isLoading ? <PendingIcon sx={{ color: "#1de9b6"}} /> : <SendIcon sx={{ color: "#1de9b6"}} />}
                sx={{ padding: 0, background: "none", boxShadow: "none", color: "white", "&:hover" : { boxShadow: "none", background: "none", }}}
                >    
                </Button>
              </Box>
            </Box>
          )}

          {/* Show Comments */}
          <Box sx={{ width: isMobile ? "95%" : "79%", textAlign: "left", marginX: "auto"}}>
            { tour?.comments?.length > 0 ? (
              <Typography variant='h4' fontWeight={600} sx={{ marginY: "1rem"}} >{ tour?.comments?.length} comments</Typography>
            ) : (
              <Typography variant='h4' fontWeight={600} sx={{ marginY: "1rem"}} >No Comments Yet</Typography>
            )}
          <Divider sx={{ width: isMobile ? "100%" : "80%", marginY: "0.5rem"}} />
          { tour?.comments?.length > 0 && tour?.comments?.map(comment => (
            <Box sx={{ marginY: "0.7rem"}}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant='h5' sx={{ fontWeight: 600}}>{ comment.userName}</Typography>
                <HorizontalRuleIcon sx={{ marginX: "0.5rem", width: "10px"}} />
                <Typography variant='body2' sx={{ fontSize: "0.9rem"}}>{ moment(tour?.date).format('MMMM Do YYYY')}</Typography>  
              </Box>
              <Typography variant='body2' component="p">{comment?.comment}</Typography>
            </Box>
          ))}
          </Box>
        </Grid>      
      </Box>
    </Box>
  )
}

export default TourDetail