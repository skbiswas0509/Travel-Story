import axiosInstance from '../utils/axiosInstance'

const uploadImage = async (imageFile) => {
    const formData = new formData();
    //apend image file to form data
    formData.append('image',imageFile);

    try {
        const response = await axiosInstance.post('/image-upload', formData, {
            header: {
                'Content-Type': 'multipart/form-data', //set header for file upload
            },
        });
        return response.data;
    } catch (error) {
        console.log("Error uploading the file");
        throw error;
    }
} 

export default uploadImage;