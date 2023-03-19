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
import { useSelector, useDispatch} from "react-redux"
import { Link, useParams, useNavigate } from 'react-router-dom'
// import { getTours } from '../redux/features/tourSlice';
import { getToursByUserApi } from '../redux/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Buffer } from 'buffer'
import { toast } from "react-toastify"
// import { deleteTour } from '../redux/features/tourSlice';
import { getToursByUser } from '../redux/features/tourSlice';
import * as api  from "../redux/api";


// icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const Dashboard = () => {
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const user = useSelector(state => state?.auth?.user);
    // const user = JSON.parse(localStorage.getItem("profile"));

    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    // console.log(user);
    const { id: userId } = useParams();
    const navigate = useNavigate();
    // const useruserid = user?.result?._id;


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
          toast.error(error?.response?.data?.message || "Something went wrong");
        },
        onSettled: () => {
          queryClient.invalidateQueries("tours");
        },
      }
    );
  
    // Delete
    const handleDelete = (id) => {
      if(window.confirm("Are you sure to delete")) {
        
        // This is redux delete
        // dispatch(deleteTour({ id, toast }));

        deleteTourQuery.mutate({id})
      }
    }

    // useEffect( () => {
    //  dispatch(getToursByUser(userId))
    // }, [])

    useEffect( () => {
      if(!user) {
        navigate("/")
      }
    }, [user])


    const { isLoading, isError, data, error } = useQuery('dashboard', () => getToursByUserApi(userId));
    // console.log(isError, error);
    if (isLoading) {
      return <h1 className='mt-5'>Loading...</h1>
    }
     const userTours = data?.data?.userTours;
    //  console.log(userTours);




  return (
    <Box paddingX={ isMobile ? 1 : 8} paddingY={4} style={{margin: 'auto', marginTop: '4rem'}}>
      <Typography variant='h1' gutterBottom sx={{ textAlign: "center"}}>Dashboard of {user?.result?.name || "Unknow"} </Typography>
      <Divider sx={{ marginBottom: "1rem"}} />
      <Stack direction="column" spacing={2} paddingX={isMobile ? 7 : 12} sx={{ display: "flex", justifyContent: "center"}}>

          {/* Delete And Error Loading */}
         {deleteTourQuery.isLoading && <h1>Loading...</h1>}
         {deleteTourQuery.isError && <div>Something is wrong</div>}

        { userTours.length > 0 &&  userTours.map( tour => (
        <Card 
          key={tour?._id}
          sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", padding: 1, height: !isMobile && "300px", overflow: "auto", boxShadow: "none",  transition: "border-color 0.2s",
          "&:hover": {
            borderColor: theme.customBorder,
          }}}
          >
          <CardMedia
              component="img"
              sx={{ width: isMobile ? "100%" : "40%" , objectFit: "cover", height: "auto" }}
              image={`data:${tour?.image?.contentType};base64,${Buffer.from(tour?.image?.data).toString('base64')}`}
              alt="Live from space album cover"
            />
          {/* <Box sx={{ display: 'flex', flexDirection: 'column', width: "50%", }}> */}
            <CardContent sx={{ justifyContent: "space-between", width: isMobile ? "100%" : "80%", display: "flex", flexDirection: "column", alignItems: "flex-start", paddingX: isMobile ? 1 : 3}}>
              <Typography gutterBottom variant="h4" sx={{ fontSize: isMobile ? 14 : 20}}>
                { tour?.title } 
              </Typography>
              <Typography gutterBottom  component="h6" color="black" sx={{ fontSize: isMobile ? 13 : 14, overflow: "auto"}}>
                { isMobile ? strCut( tour?.description, 200) : strCut(tour?.description, 600) }
              </Typography>
              <Box sx={{ display: "flex", marginTop: 1}}>
                <IconButton aria-label="delete" size='small' color="error" sx={{ padding : 0, marginRight: 1}} onClick = { () => handleDelete(tour?._id)}>
                  <DeleteIcon />
                </IconButton>
                <Link to={`/tours/createOrEdit/${tour?._id}`}>
                  <IconButton  size='small' color="info" sx={{ padding : 0}}>
                    <EditIcon />
                  </IconButton>
                </Link>
              </Box>
            </CardContent>
          {/* </Box> */}
        </Card>
        ))}
      </Stack>
    </Box>

  )
}

export default Dashboard