import { Session } from 'next-auth';
import React from 'react';

type chatProps = {
    session : Session | null
};

const Chat:React.FC<chatProps> = ({session}) => {
    
    return <div>Have a good coding:Chat</div>
}
export default Chat;