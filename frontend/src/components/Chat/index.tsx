import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import React from 'react';

type chatProps = {
    session : Session | null
};

const Chat:React.FC<chatProps> = ({session}) => {
    const sign_Out = ()=>{
        signOut()
    }
    
    return <div>Have a good coding:Chat <button onClick={sign_Out}>SignOut</button></div>
}
export default Chat;