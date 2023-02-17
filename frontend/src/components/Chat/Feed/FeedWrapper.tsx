import { Session } from 'next-auth';
import React from 'react';
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import MessageInput from "./Input";
import MessagesHeader from "./Messages/Header";
import Messages from "./Messages/Messages";
import NoConversationSelected from "./NoConversationSelected";

type FeedWrapperProps = {
    session:Session
};

const FeedWrapper:React.FC<FeedWrapperProps> = ({session}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const conversationId = searchParams.get('conversationId');
    
    return (
        <Flex
        display={{ base: conversationId ? "flex" : "none", md: "flex" }}
        direction="column"
        width="100%">
            {conversationId && typeof conversationId === "string" ?(
            <>
             <Flex direction="column"
                   justify="space-between"
                   overflow="hidden"
                   flexGrow={1}
             >
            <MessagesHeader
              userId={session.user.id}
              conversationId={conversationId}
            />
            <Messages
              userId={session.user.id}
              conversationId={conversationId}
            />
            </Flex>
            <MessageInput session={session} conversationId={conversationId} />
            </>):(
            <>
             <NoConversationSelected />
            </>)}
        </Flex>
        
    )
}
export default FeedWrapper;