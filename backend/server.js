import dotenv from 'dotenv';
import {prisma} from './src/config/client.js'
import app from './app.js'

dotenv.config();

const PORT = process.env.PORT || 3000;

await prisma.$connect();
console.log('DB connected');

app.listen(PORT , () => {
    console.log(`Server is running at port : ${PORT}`)
})