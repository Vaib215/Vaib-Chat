import {config} from "dotenv"
config()
import fastify from "fastify"
import cors from "@fastify/cors"
import { userRoutes } from "./routes/users"

const app = fastify()
app.register(cors, {origin: '*'})
app.register(userRoutes)

app.listen({host: '0.0.0.0',port: 3000},(err)=>{
    if(err) console.log(err);
    else console.log("Server running at :", 3000);
})