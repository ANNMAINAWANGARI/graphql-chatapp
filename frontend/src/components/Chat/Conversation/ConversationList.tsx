import { Box, Button, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from "next-auth/react";
import React, { useState } from 'react';
import ConversationModal from './Modal/Modal';
import {
    ConversationPopulated,
  } from "../../../../../backend/src/utils/types";
import ConversationItem from './ConversationItem';
  

interface ConversationListProps  {
    session:Session
    conversations: Array<ConversationPopulated>
   
};

const ConversationList:React.FC<ConversationListProps> = ({session,conversations}) => {
    const [open,setOpen] = useState(false);
    const onOpen = ()=>setOpen(true)
    const onClose = ()=>setOpen(false)
    return (
        <Box width='100%' overflow="hidden">
            <Box
            py={2}
            px={4}
            mb={4}
            bg="blackAlpha.300"
            borderRadius={4}
            cursor="pointer"
            onClick={onOpen}>
                <Text color="whiteAlpha.800" fontWeight={500}>Find or start a conversation</Text>
                
            </Box>
            <ConversationModal isOpen={open} onClose={onClose} session={session} />
            {conversations.map((conversation)=>(<ConversationItem conversation={conversation} key={conversation.id}/>))}
            <Box
             position="absolute"
             bottom={0}
             left={0}
             width="100%"
             bg="#313131"
             px={8}
             py={6}
             zIndex={1}
            >
             <Button width="100%" onClick={() => signOut()}> Logout</Button>
            </Box>
    </Box>
        
    )
}
export default ConversationList;