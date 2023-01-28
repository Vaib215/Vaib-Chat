import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Channel, ChannelHeader, ChannelList, ChannelListMessengerProps, Chat, LoadingIndicator, MessageInput, MessageList, useChatContext, Window } from 'stream-chat-react'
import { useLoggedInAuth } from '../context/AuthContext'

export const Home = () => {
  const { user, streamChat } = useLoggedInAuth()
  if (streamChat == null) return <LoadingIndicator />
  return <Chat client={streamChat}>
    <ChannelList
      List={Channels}
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
    <div className="w-60 flex flex-col gap-4 m-3 h-f">
      <Link to='/channel/new' className='btn btn-primary'>New Conversation</Link>
      <hr />
      <div className="menu">
        {loadedChannels!= null && loadedChannels.length > 0 ?
          loadedChannels.map(channel => {
            const isActive = channel === activeChannel
            return (<button onClick={()=>setActiveChannel(channel)} className={isActive? "active":""} disabled={isActive} key={channel.id}>
              <div className="avatar">
                <img className='w-24' src={channel.data?.image} alt={channel.data?.name} />
              </div>
            </button>)
          }):<p className='text-center'>No Conversations</p>}
      </div>
    </div>
  )
}