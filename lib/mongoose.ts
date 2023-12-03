import mongoose from 'mongoose';

let isConnected=false:

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if(!process.env.DB_URL) return console.log('DB_URL not found')
  if(isConnected) return console.log('Already connected to Database')

  try {
    await mongoose.connect(process.env.DB_URL);
    isConnected = true

    console.log('connected to Database');
  }
  catch (error) {
    console.log(error);
  }
}
