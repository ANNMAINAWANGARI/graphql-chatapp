import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React from 'react';
import ConversationList from './ConversationList';
import ConversationOperations from '../../../graphql/operations/conversation'
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { ConversationsData } from '@/utils/types';

interface ConversationWrapperProps  {
    session:Session
};

const ConversationWrapper:React.FC<ConversationWrapperProps> = ({session}) => {
    //https://github.com/apollographql/apollo-client/blob/main/src/core/ApolloClient.ts#L314
    //https://www.apollographql.com/docs/react/data/queries
    //https://www.apollographql.com/docs/react/api/core/ApolloClient#ApolloClient.query
    const {data:conversationsData,error:conversationsError,loading:conversationsLoading} = useQuery<ConversationsData,any>(ConversationOperations.Queries.conversations,{variables:null})
    console.log('yooy',conversationsData)
    return (
        <Box
        width={{ base: "100%", md: "400px" }}
        bg="whiteAlpha.50"
        py={6}
        px={3}
        position="relative"
        border='1px solid red'>
            {conversationsLoading ?(
                <SkeletonLoader count={7} height="80px" width="360px" />
            ):(
                <ConversationList session={session} conversations={conversationsData?.conversations || []}/>
            )}
            
        </Box>
    )
}
export default ConversationWrapper;