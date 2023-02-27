import React from 'react';
import { Button, Stack, Text } from "@chakra-ui/react";
import ConversationOperations from "../../../../graphql/operations/conversation";
import { useQuery } from "@apollo/client";
import { ConversationsData } from '@/utils/types';
import { useRouter } from 'next/navigation';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { formatUsernames } from '@/utils/functions';

type HeaderProps = {
    userId: string;
    conversationId: string;
};

const Header:React.FC<HeaderProps> = ({userId,conversationId}) => {
    const router = useRouter();
    const { data, loading } = useQuery<ConversationsData,any>(
        ConversationOperations.Queries.conversations
      );
      //console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',data)
      const conversation = data?.conversations.find(
        (conversation) => conversation.id === conversationId
      );
    
      if (data?.conversations && !loading && !conversation) {
        router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
      }
    
    return(
        <Stack
        direction="row"
        align="center"
        spacing={6}
        py={5}
        px={{ base: 4, md: 0 }}
        borderBottom="1px solid"
        borderColor="whiteAlpha.200">
            <Button 
             display={{ md: "none" }} 
             onClick={()=>router.replace( "/")}
             >
                Back
            </Button>
            {loading && <SkeletonLoader count={1} height="30px" width="320px" />}
            {!conversation && !loading && <Text>Conversation Not Found</Text>}
      {conversation && (
        <Stack direction="row">
          <Text color="whiteAlpha.600">To: </Text>
          <Text fontWeight={600}>
            {formatUsernames(conversation.participants, userId)}
          </Text>
          </Stack>
      )}
        </Stack>
    )
}
export default Header;