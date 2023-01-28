import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { FormEvent, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Select, { SelectInstance } from "react-select"
import { FullScreenCard } from "../../components/FullScreenCard"
import { Input } from "../../components/Input"
import { useLoggedInAuth } from "../../context/AuthContext"

const NewChannel = () => {
    const { streamChat, user } = useLoggedInAuth()
    const navigate = useNavigate()
    const newChannel = useMutation({
        mutationFn: ({
            name, memberIds, imageUrl, category
        }: {
            name: string, memberIds: string[], imageUrl: string, category: string
        }) => {
            if (streamChat == null) throw "Not Connected"
            return streamChat.channel(category, crypto.randomUUID(), {
                name, image: imageUrl, members: [user!.id, ...memberIds]
            }).create()
        },
        onSuccess: () => {
            navigate("/")
        }
    })

    const users = useQuery({
        queryKey: ["stream", "users"],
        queryFn: () => streamChat!.queryUsers({ id: { $ne: user!.id } }, { name: 1 }),
        enabled: streamChat != null
    })

    const nameRef = useRef<HTMLInputElement>(null)
    const imageRef = useRef<HTMLInputElement>(null)
    const membersRef = useRef<SelectInstance<{ label: string, value: string }>>(null)
    const [imageUrl, setImageUrl] = useState<string>("")

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const name = nameRef.current?.value
        const image = imageRef.current?.files?.[0]
        const members = membersRef.current?.getValue()

        if (image) {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('public_id', "" + name + crypto.randomUUID())
            formData.append('upload_preset', 'user_profile');
            await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then((response) => {
                setImageUrl(response.data.secure_url)
            })
            .catch(err => console.log(err))
        }
        if (name && members) {
            newChannel.mutate({
                name, memberIds: members.map(member => member.value), imageUrl: imageUrl, category:"messaging"
            })
        }

    }

    return (
        <FullScreenCard>
            <FullScreenCard.Body>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <h1 className="card-title">New Conversation</h1>
                    <Input
                        id="name"
                        placeholder="Create a name"
                        type="text"
                        pattern="\S*"
                        ref={nameRef}
                        required
                    >
                        Name
                    </Input>
                    <div className="form-control w-full">
                        <label htmlFor="image" className="label">
                            <span className="label-text">Profile Picture</span>
                        </label>
                        <input ref={imageRef} id="image" type="file" accept="image/*" />
                    </div>
                    <div className="form-control w-full">
                        <label htmlFor="members" className="label">
                            <span className="label-text">Members</span>
                        </label>
                        <Select ref={membersRef} className="input input-bordered" id="members" required isMulti classNames={{ container: () => "w-full bg-base-100" }} isLoading={users.isLoading} options={users.data?.users.map(user => { return { value: user.id, label: user.name || user.id } })} />
                    </div>
                    <div className="form-control w-full">
                        <label htmlFor="category" className="label">
                            <span className="label-text">Category</span>
                        </label>
                    </div>
                    <button disabled={newChannel.isLoading} className="btn btn-primary w-full">
                        {newChannel.isLoading ? "Loading..." : "Create"}
                    </button>
                </form>
            </FullScreenCard.Body>
            <FullScreenCard.BelowCard>
                <Link to='/' className="link">Back</Link>
            </FullScreenCard.BelowCard>
        </FullScreenCard>
    )
}

export default NewChannel