import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React from 'react';
import ConversationList from './ConversationList';

interface ConversationWrapperProps  {
    session:Session
};

const ConversationWrapper:React.FC<ConversationWrapperProps> = ({session}) => {
    
    return (
        <Box
        width={{ base: "100%", md: "400px" }}
        bg="whiteAlpha.50"
        py={6}
        px={3}
        position="relative"
        border='1px solid red'>
            <ConversationList session={session}/>
        </Box>
    )
}
export default ConversationWrapper;