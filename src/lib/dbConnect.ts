import mongoose from "mongoose";

type ConnectionObject = {
  isConneted?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
    if(connection.isConneted){
        console.log('Already connected to database')
        return;
    }
    try{
        const db = await  mongoose.connect(process.env.MONGODB_URI || "",{})
      
       
        connection.isConneted = db.connections[0].readyState

        console.log(`DB connected successfully`)
    }catch(err){
        console.log(`Database connection failed : `,err)
        process.exit(1)
    }
};

export default dbConnect;
