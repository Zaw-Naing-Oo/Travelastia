import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import * as api  from "../redux/api";



const SingleCard = (props) => {
  const { tour } = props;
  const userId = useSelector(state => state?.auth?.user?.result?._id);
  const [isLiked, setIsLiked] = useState(Boolean(tour?.likes?.[userId]));
  const navigate = useNavigate();
  // console.log(tour)
  // console.log(isLiked)


  const tag = tour?.tags.join(",").split(",").map( (tag,index) => (
    <Typography key={index} gutterBottom variant="body2" mr={1} sx={{ display: "flex"}}>
        { `#${tag}`}
    </Typography>
  ));

  // String cut function
  const strCut = (str) => {
    if(str.length > 70) {
      str = str.substring(0, 70) + "..."
    }
    return str;
  }

    // Define mutation function to handle liking a tour
    const likeOrUnlikeTourMutation = useMutation(
      (tourId) => api.likeTour(tourId, userId),
      {
        // Optimistically update the cache when the mutation is triggered
        optimisticUpdates: {
          // Update the tour in the cache with the new like count
          [['tour', tour._id]]: (existingTour) => ({
            ...existingTour,
            likes: existingTour.likes.set(userId, true),
          }),
        },
        onSuccess: () => {
          // The cache is already updated optimistically, so there's nothing to do here
        },
      }
    );
    

    // Handle the like button click event
    const handleLike = (tourId) => {
      if(!userId) {
        return navigate("/login");
      }
      if(isLiked) {
        likeOrUnlikeTourMutation.mutate(tourId);
        setIsLiked(false);
      } else {
        likeOrUnlikeTourMutation.mutate(tourId);
        setIsLiked(true);
      }
    };

    useEffect(() => {
      setIsLiked(Boolean(tour?.likes?.[userId]));
    }, [userId, tour]);
  

  return (
    <Card
      sx={{
        backgroundColor: "#f5f5f5",
        boxShadow: "0px 3px 3px rgba(46, 125, 50, 0.25)",
        border: "1px solid rgba(46, 125, 50, 0.5)",
        color: "#222222",
      }}
    >
      <CardMedia
        sx={{ height: 150 }}
        image={`data:${tour?.image?.contentType};base64,${Buffer.from(tour?.image?.data).toString('base64')}`}
        title={props?.tour?.title || ""}
        />
      <CardContent 
        sx={{ height: 140 }}
      >
        <Typography gutterBottom variant="h4">
          { tour?.title }
        </Typography>
        <div className='d-flex text-black-50'>
          { tag }
        </div>
        <Typography variant="body2" component="h6" color="black">
          { strCut(tour?.description)}
        </Typography>
      </CardContent>
      <CardActions>
      <Button variant="outlined" size='small' onClick={ () => navigate(`detail/${tour?._id}`)}>See More</Button>
      <IconButton aria-label="favorite" onClick={ () => handleLike(tour?._id)}>
         { isLiked ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteIcon />}
      </IconButton>
      </CardActions>
    </Card>
  )
}

export default SingleCard