import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import customerRouter from "./routes/customer.routes.js";
import dns from 'dns'
import cors from 'cors'
import productRouter from "./routes/product.routes.js";

// to fis the dns issue 
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);

dotenv.config() //read env and make values available through process
const app = express()
const PORT = process.env.PORT || 8000


// middlewars 

app.use(cors({
    credentials:true, // for token passing 
    origin:"http://localhost:5173",
}))
app.use(express.json())
app.use(cookieParser())


app.use("/customers", customerRouter);
app.use("/products", productRouter);

mongoose.connect(process.env.dbUrl).then(() => {
    console.log("DB Connected")
}).catch((err) => {
    console.log(err)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})