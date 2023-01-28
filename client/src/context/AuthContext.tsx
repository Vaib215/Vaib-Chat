import { useMutation, UseMutationResult } from "@tanstack/react-query"
import axios, { AxiosResponse } from "axios"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { StreamChat } from "stream-chat"
import { useLocalStorage } from "../hooks/UseLocalStorage"

type AuthContext = {
    user?: User | null,
    streamChat?: StreamChat | undefined,
    signup: UseMutationResult<AxiosResponse, unknown, User>,
    login: UseMutationResult<{ success: string, token: string, user: User }, unknown, { id: string, password: string }>
}

type User = {
    id: string
    name: string
    image?: string
    password?: string
}

const Context = createContext<AuthContext | null>(null)

export const useAuth = () => {
    return useContext(Context) as AuthContext
}

export const useLoggedInAuth = () => {
    return useContext(Context) as AuthContext & Required<Pick<AuthContext,"user">>
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const navigate = useNavigate()
    const [user, setUser] = useLocalStorage<User | null>("user")
    const [token, setToken] = useLocalStorage<string | null>("token")
    const [streamChat, setStreamChat] = useState<StreamChat | undefined>(undefined)
    const signup = useMutation({
        mutationFn: (user: User) => {
            return axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, user)
        },
        onSuccess() {
            navigate('/login')
        }
    })
    const login = useMutation({
        mutationFn: ({ id, password }: { id: string, password: string }) => {
            return axios.post(`${import.meta.env.VITE_SERVER_URL}/login`, { id, password })
                .then((res) => {
                    return res.data as { success: string, token: string, user: User }
                })
        },
        onSuccess(data) {
            setUser(data.user)
            setToken(data.token)
        }
    })
    useEffect(() => {
        if (user == null || token == null) return
        const chat = new StreamChat(import.meta.env.VITE_STREAM_API_KEY!)

        if(chat.tokenManager.token === token  && chat.userID === user.id) return

        let isInterrupted = false
        const connectPromise = chat.connectUser(user,token).then(() => {
            if(isInterrupted) return
            setStreamChat(chat)
        })
        return () => {
            isInterrupted = true
            setStreamChat(undefined)
            connectPromise.then(() => chat.disconnectUser())
        }
    }, [user, token])

    return <Context.Provider value={{ signup, login, user, streamChat }}>
        {children}
    </Context.Provider>
}