import { FastifyInstance } from "fastify";
import {StreamChat} from "stream-chat"

const streamChat = StreamChat.getInstance(process.env.STREAM_API_KEY!,process.env.STREAM_API_SECRET!)

const TOKEN_USERID_MAP = new Map<string, string>()

export const userRoutes = async (app:FastifyInstance) => {
    app.post<{Body: {id:string, name:string, image?:string, password:string}}>("/signup",async(req,res)=>{
        res.header("Access-Control-Allow-Origin", "*")
        const {id, name, image, password} = req.body
        if(id===null || name===null || id==="" || name==="" || password===null || password===""){
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
        await streamChat.upsertUser({id, name, image, password})
        return res.status(200).send({
            success: "true",
            message: "User created successfully"
        })
    })
    app.post<{Body: {id:string, password:string}}>("/login",async(req,res)=>{
        res.header("Access-Control-Allow-Origin", "*")
        const {id, password} = req.body
        if(id===null || id==="" || password===null || password===""){
            return res.status(400).send({
                success: "false",
                message: "Please enter the correct details"
            })
        }
        
        const {
            users: [user]
        } = await streamChat.queryUsers({id})
        if(user==null){
            return res.status(401).send({
                success: "false",
                message: "Invalid Credentials"
            })
        }

        if(user.password!==password){
            return res.status(401).send({
                success: "false",
                message: "Invalid Credentials"
            })
        }

        const token = streamChat.createToken(user.id)
        TOKEN_USERID_MAP.set(token, user.id)

        return res.status(200).send({
            success: "true",
            token,
            user: {
                id: user.id,
                name: user.name,
                image: user.image
            }
        })
    })
    app.post<{Body: {token: string}}>("/logout",async(req,res)=>{
        const token = req.body.token
        if(token==null || token==""){
            return res.status(400).send({
                success: "false",
                message: "User already logged out"
            })
        }
        
        const id = TOKEN_USERID_MAP.get(token)
        if(id==null){
            return res.status(400).send({
                success: "false",
                message: "User already logged out"
            })
        }
        await streamChat.revokeUserToken(id, new Date())
        TOKEN_USERID_MAP.delete(token)
    })
}