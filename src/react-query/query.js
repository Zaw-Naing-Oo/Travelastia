import { useMutation } from 'react-query';
import * as api from "../redux/api"
import { setUser } from '../redux/features/authSlice';
import { useDispatch } from 'react-redux';

export const useLogin = () => {
   const dispatch = useDispatch();
  const signIn = async (formValue) => {
   const response = await api.signIn(formValue);
   dispatch(setUser(response?.data));
   return response.data;
  }
  const { mutate, isLoading, isError } = useMutation(signIn);

  return {
   mutate,
   isLoading,
   isError
 };
}

export const useRegister = () => {
   const dispatch = useDispatch();
   const signUp = async (formValue) => {
   const response = await api.signUp(formValue);
   dispatch(setUser(response?.data));
   return response.data;
  }
  const { mutate, isLoading, isError } = useMutation(signUp);

  return {
   mutate,
   isLoading,
   isError
 };
}

export const useCreateTourMutation = () => {
  return useMutation(async ({ title, description, imageFile, tags, imageType, name, imageName, userId }) => {
     // create form data and append fields
     const updatedFormData = new FormData();
     updatedFormData.append("title", title);
     updatedFormData.append("description", description);
     updatedFormData.append("name", name);
     updatedFormData.append("tags", tags);
     if(imageFile) {
        updatedFormData.append("image", imageFile);
        updatedFormData.append("imageType", imageType);
        updatedFormData.append("imageName", imageName);
     }
     updatedFormData.append("userId", userId)
     console.log(userId);

     const response = await api.createTour(updatedFormData);
     return response.data;
  });
};

export const useUpdateTourMutation = () => {
    return useMutation(async ({ title, description, imageFile, tags, imageType, imageName, id }) => {
       // create form data and append fields
       const updatedFormData = new FormData();
       updatedFormData.append("title", title);
       updatedFormData.append("description", description);
       updatedFormData.append("tags", tags);
       updatedFormData.append("image", imageFile);
       updatedFormData.append("imageType", imageType);
       updatedFormData.append("imageName", imageName);
  
       const response = await api.updateTourApi(id, updatedFormData); 
       return response.data;
    });
};
