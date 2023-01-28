import { Link } from 'react-router-dom'
import { Channel, ChannelHeader, ChannelList, ChannelListMessengerProps, Chat, LoadingIndicator, MessageInput, MessageList, useChatContext, Window } from 'stream-chat-react'
import { useLoggedInAuth } from '../context/AuthContext'

export const Home = () => {
  const { user, streamChat } = useLoggedInAuth()
  if (streamChat == null) return <div className="flex items-center justify-center min-h-screen"><LoadingIndicator size={64}/></div>
  return <Chat client={streamChat}>
    <ChannelList
      List={Channels}
      sendChannelsToList={true}
      filters={{ members: { $in: [user!.id] } }}
    />
    <Channel>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
    </Channel>
  </Chat>
}

function Channels({ loadedChannels }: ChannelListMessengerProps) {
  const { setActiveChannel, channel: activeChannel } = useChatContext()
  return (
    <div className="w-[80vw] md:w-72 flex flex-col gap-4 p-3 h-full bg-base-300 text-base-content">
      <Link to='/channel/new' className='btn btn-primary'>New Conversation</Link>
      <hr />
      <ul className="menu">
        {loadedChannels!= null && loadedChannels.length > 0 ?
          loadedChannels.map(channel => {
            const isActive = channel === activeChannel
            return (<li className='rounded-md overflow-hidden' key={channel.id}><button onClick={()=>setActiveChannel(channel)} className={isActive? "active":""} disabled={isActive} >
                <div className="avatar overflow-hidden w-8 h-8">{channel.data?.image ? <img src={channel.data?.image} alt={channel.data?.name} />: <h1 className='bg-secondary w-8 h-8 rounded-full flex items-center justify-center'>{channel.data?.name?.slice(0,1)}</h1>}
                </div>
              <b className="text-left">{channel.data?.name || channel.id}</b>
            </button></li>)
          }):<p className='text-center'>No Conversations</p>}
      </ul>
      <button className='btn btn-primary mt-auto'>Logout</button>
    </div>
  )
}