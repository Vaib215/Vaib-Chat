import { FastifyInstance } from "fastify";
import {StreamChat} from "stream-chat"

const streamChat = StreamChat.getInstance(process.env.STREAM_API_KEY!,process.env.STREAM_API_SECRET!)

export const userRoutes = async (app:FastifyInstance) => {
    app.post<{Body: {id:string, name:string, image?:string}}>("/signup",async(req,res)=>{
        res.header("Access-Control-Allow-Origin", "*")
        const {id, name, image} = req.body
        if(id===null || name===null || id==="" || name===""){
            return res.status(400).send({
                success: "false",
                message: "Please enter the correct details"
            })
        }

        const existingUsers = await streamChat.queryUsers({id})
        if(existingUsers.users.length>0){
            return res.status(400).send({
                success: "false",
                message: "Username is already taken"
            })
        }
        await streamChat.upsertUser({id, name, image})
        return res.status(200).send({
            success: "true",
            message: "User created successfully"
        })
    })
}