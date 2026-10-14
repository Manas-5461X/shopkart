import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import dns from 'dns'
import cors from 'cors'
import helmet from 'helmet'
import customerRouter from "./routes/customer.routes.js";
import productRouter from "./routes/product.routes.js";
import wishlistRouter from './routes/wishlist.routes.js';
import cartRouter from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';


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


// Trust reverse proxy (e.g. Render, Railway, Heroku, AWS ELB) so secure cookies work
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// Security and standard middlewares 
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}))

const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/+$/, '') : '';
const allowedOrigins = [
    "http://localhost:5173",
    clientUrl
].filter(Boolean);

app.use(cors({
    credentials: true, // for token passing 
    origin: (origin, callback) => {
        const cleanOrigin = origin ? origin.replace(/\/+$/, '') : origin;
        if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) {
            callback(null, true);
        } else {
            callback(new Error(`Blocked by CORS policy: ${origin}`));
        }
    },
}))
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())


app.use("/customers", customerRouter);
app.use("/products", productRouter);
app.use("/wishlist", wishlistRouter);
app.use("/cart", cartRouter);
app.use('/api/orders', orderRoutes);

mongoose.connect(process.env.dbUrl).then(() => {
    console.log("DB Connected")
}).catch((err) => {
    console.log(err)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})