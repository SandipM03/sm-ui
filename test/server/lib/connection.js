const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
export const connectDb= async()=>{
    const url= process.env.MONGODB_URL;
    try{
        await(mongoose.connect(url));
        console.log('Connected to MongoDB');


    }catch(error){
        console.error('Error connecting to MongoDB:', error);
    }
};
