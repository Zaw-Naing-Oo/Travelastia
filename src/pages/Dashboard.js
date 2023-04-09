import React, { useEffect } from 'react'
import Box from "@mui/material/Box"
import Typography  from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardContent from '@mui/material/CardContent';
import CardMedia from "@mui/material/CardMedia"
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from "@mui/material/IconButton"
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { useSelector} from "react-redux"
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getToursByUserApi } from '../redux/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Buffer } from 'buffer'
import { toast } from "react-toastify"
import Lottie from "lottie-react"
import * as api  from "../redux/api";
import * as Nodata from "../images/nodatafound.json"


// icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Dashboard = () => {
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const user = useSelector(state => state?.auth?.user);

    const queryClient = useQueryClient();
    const { id: userId } = useParams();
    const navigate = useNavigate();


    // String cut function
    const strCut = (str, maxLength) => {
      if (str.length > maxLength) {
        str = str.substring(0, maxLength) + "...";
      }
      return str;
    };

    // Delete Quyery
    const deleteTourQuery = useMutation(
      ({ id }) => api.deleteTourApi(id),
      {
        onSuccess: () => {
          toast.success("Deleted Successfully");
          navigate("/tours")
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "You cannot delete right now");
        },
        onSettled: () => {
          queryClient.invalidateQueries("tours");
        },
      }
    );
  
    // Delete
    const handleDelete = (id) => {
      if(window.confirm("Are you sure to delete")) {
        deleteTourQuery.mutate({id})
      }
    }

    const { isLoading, isError, data, error } = useQuery('dashboard', () => getToursByUserApi(userId));
    const userTours = data?.data?.userTours;


    useEffect( () => {
      if(user?.result?._id == null) {
        navigate("/")
      }
    }, [user?.result?._id])


    

  return (
    <Box paddingX={ isMobile ? 1 : 8} paddingY={4} sx={{ margin: 'auto', minHeight: "100vh", background: "#e0f2f1"}}>
      <Typography variant='h1' gutterBottom sx={{ textAlign: "center",}}>
        Dashboard of { isMobile ? <br /> : " "}
        {user?.result?.name || "Unknow"} 
      </Typography>
      <Divider />

      { userTours?.length === 0 && (
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh"
        }}>
          <Lottie animationData={Nodata} loop={true} autoplay />
        </Box>
      )}

      <Stack direction="column" spacing={2} paddingX={isMobile ? 3 : 8} sx={{ display: "flex", justifyContent: "center", marginTop: "2rem"}}>
      {/* Delete  Loading */}
      {/* { deleteTourQuery.isLoading && <h1>Loading...</h1> } */}

      { isLoading ? (
        [...Array(3)].map((_,index) => {
           return (
            <Box  sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", padding: 1, height: isMobile ? 400 : 300,}} >
              <Skeleton variant="rectangular" sx={{ width: isMobile ? "100%" : "50%" , height: isMobile ? 300 : "auto"}} />
              <Box sx={{ justifyContent: "space-between", width: isMobile ? "100%" : "80%", display: "flex", flexDirection: "column", alignItems: "flex-start", paddingX: isMobile ? 1 : 3}}>
                <Skeleton width="40%" />
                <Skeleton width={ !isMobile ? "100%" : "60%"} sx={{ height: !isMobile ? 300 : "auto" }} /> 
                <Box sx={{ display: "flex", width: "100%"} }>
                  <Skeleton width="10%" sx={{ marginRight: "2rem"}} />
                  <Skeleton width="10%" />
                </Box>
              </Box>
           </Box>
           )
        })
      ) : (
        userTours?.length > 0 &&  userTours.map( tour => (
          <Card 
            key={tour?._id}
            sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", padding: 1, height: !isMobile && "300px", overflow: "auto", boxShadow: "none",  transition: "border-color 0.2s", background: "none", 
            }}
            >
            <CardMedia
                component="img"
                sx={{ width: isMobile ? "100%" : "50%" , objectFit: "cover", objectPosition: "center", height: "auto", overflow: "hidden", borderRadius: "10px", }}
                image={`data:${tour?.image?.contentType};base64,${Buffer.from(tour?.image?.data).toString('base64')}`}
                alt="Live from space album cover"
            />
            <CardContent sx={{ justifyContent: "space-between", width: isMobile ? "100%" : "80%", display: "flex", flexDirection: "column", alignItems: "flex-start", paddingX: isMobile ? 1 : 3}}>
              <Typography gutterBottom variant="h4" sx={{ fontSize: isMobile ? 18 : 25, paddingX: isMobile ? 1 : 2, fontWeight: 500}}>
                { tour?.title } 
              </Typography>
              <Typography gutterBottom  component="h6" sx={{ fontSize: 14, paddingX: isMobile ? 1 : 2, overflow: "auto", lineHeight: 1.7 }}>
                { isMobile ? strCut( tour?.description, 300) : strCut(tour?.description, 800) }
              </Typography>
              <Box sx={{ display: "flex", marginTop: 1, paddingX: isMobile ? 0 : 2,}}>
                <IconButton aria-label="delete" size='small' color="error" sx={{ padding : 0, marginRight: 1}} onClick = { () => handleDelete(tour?._id)}>
                  <DeleteIcon />
                </IconButton>
                <Link to={`/tours/createOrEdit/${tour?._id}`}>
                  <IconButton  size='small' sx={{ padding : 0, color: "#00897b"}}>
                    <EditIcon />
                  </IconButton>
                </Link>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
      </Stack>
    </Box>
  )
}

export default Dashboard