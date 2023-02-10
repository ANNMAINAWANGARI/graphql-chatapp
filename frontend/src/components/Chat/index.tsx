import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import React from 'react';
import ConversationWrapper from './Conversation/ConversationWrapper';
import FeedWrapper from './Feed/FeedWrapper';

type chatProps = {
    session : Session 
};

const Chat:React.FC<chatProps> = ({session}) => {
    const sign_Out = ()=>{
        signOut()
    }
    
    return(
        <Flex height="100vh">
            <ConversationWrapper session={session}/>
            <FeedWrapper session={session}/>
        </Flex>
    )
}
export default Chat;