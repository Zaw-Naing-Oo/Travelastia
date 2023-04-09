import React, { useEffect, useState } from 'react'
import  Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Buffer } from 'buffer'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import * as api  from "../redux/api";

// icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReadMoreIcon from '@mui/icons-material/ReadMore';



const SingleCard = (props) => {
  const { tour } = props;
  const userId = useSelector(state => state?.auth?.user?.result?._id);
  const [isLiked, setIsLiked] = useState(Boolean(tour?.likes?.[userId]));
  const navigate = useNavigate();

  const tag = tour?.tags.join(",").split(",").map( (tag,index) => (
    <Typography key={index} gutterBottom variant="body2" mr={1} sx={{ display: "flex"}}>
        { `${tag}`}
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
    <Card sx={{ boxShadow: "none", position: "relative", borderRadius: "25px"}}>
      <CardMedia
        sx={{ height: 350, borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
        image={`data:${tour?.image?.contentType};base64,${Buffer.from(tour?.image?.data).toString('base64')}`}
        title={props?.tour?.title || ""}
      />
      <Typography gutterBottom variant="h4" sx={{ position: "absolute", color: "white", bottom: 90, padding: 2, fontWeight: 700, fontSize: "25px"}}>
        { tour?.title }
      </Typography>
      <Typography sx={{ position: "absolute", bottom: 70, padding: 1, color: "white", fontWeight: 700, fontSize: "15px"}}>
        <LocationOnIcon />
        { tour?.tags?.[0]}
      </Typography>
      <CardActions sx={{ borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <IconButton aria-label="favorite" onClick={ () => handleLike(tour?._id)}>
          { isLiked ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteIcon />}
        </IconButton>
        <Button size='small' onClick={ () => navigate(`detail/${tour?._id}`)}>
        <Tooltip title="Read More">
         <ReadMoreIcon sx={{ color: "#1de9b6" }} />  
        </Tooltip>
      </Button>
      </CardActions>
    </Card>
  )
}

export default SingleCard