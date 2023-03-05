import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import React from 'react'
import { Buffer } from 'buffer'
import { Navigate, useNavigate } from 'react-router-dom'

const SingleCard = (props) => {
  const navigate = useNavigate();

  const tag = props?.tour?.tags.join(",").split(",").map( (tag,index) => (
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
        image={`data:${props.tour?.image?.contentType};base64,${Buffer.from(props.tour?.image?.data).toString('base64')}`}
        title={props?.tour?.title || ""}
        />
      <CardContent 
        sx={{ height: 140 }}
      >
        <Typography gutterBottom variant="h4">
          { props?.tour?.title }
        </Typography>
        <div className='d-flex text-black-50'>
          { tag }
        </div>
        <Typography variant="body2" component="h6" color="black">
          { strCut(props?.tour?.description)}
        </Typography>
      </CardContent>
      <CardActions>
      <Button variant="outlined" size='small' onClick={ () => navigate(`detail/${props?.tour?._id}`)}>See More</Button>
      </CardActions>
    </Card>
  )
}

export default SingleCard