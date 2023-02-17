import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import ConversationModal from './Modal/Modal';
import {
    ConversationPopulated,
  } from "../../../../../backend/src/utils/types";
  

interface ConversationListProps  {
    session:Session
    conversations: Array<ConversationPopulated>
   
};

const ConversationList:React.FC<ConversationListProps> = ({session}) => {
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
        </Box>
    )
}
export default ConversationList;