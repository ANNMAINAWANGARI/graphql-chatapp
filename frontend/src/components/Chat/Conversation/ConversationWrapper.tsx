import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React,{useEffect} from 'react';
import ConversationList from './ConversationList';
import ConversationOperations from '../../../graphql/operations/conversation'
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { ConversationCreatedSubscriptionData, ConversationsData } from '@/utils/types';
import { ConversationPopulated } from '../../../../../backend/src/utils/types';
import { useRouter, useSearchParams } from 'next/navigation';

interface ConversationWrapperProps  {
    session:Session
};

const ConversationWrapper:React.FC<ConversationWrapperProps> = ({session}) => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const conversationId = searchParams.get('conversationId');
    //https://github.com/apollographql/apollo-client/blob/main/src/core/ApolloClient.ts#L314
    //https://www.apollographql.com/docs/react/data/queries
    //https://www.apollographql.com/docs/react/api/core/ApolloClient#ApolloClient.query
    const {data:conversationsData,error:conversationsError,loading:conversationsLoading,subscribeToMore} = useQuery<ConversationsData,any>(ConversationOperations.Queries.conversations,{variables:null})
    const subscribeToNewConversation = ()=>{
        subscribeToMore({
            document:ConversationOperations.Subscriptions.conversationCreated,
            updateQuery: (prev, { subscriptionData }:{subscriptionData:{data:{conversationCreated:ConversationPopulated}}}) => {
                //console.log('subdata',subscriptionData)
                if (!subscriptionData.data) return prev;
                const newConversation = subscriptionData.data.conversationCreated;
                return Object.assign({
                    conversations:[newConversation,...prev.conversations]
                })
            }
        })
    }
    const onViewConversation = async(conversationId:string)=>{
        // Push the conversationId to the router query params
        //console.log('clicked')
        router.push(`/?conversationId=${conversationId}`)
        // Mark conversation as read
    }
    useEffect(()=>{
        subscribeToNewConversation()
    },[])
    
    return (
        <Box
        width={{ base: "100%", md: "400px" }}
        bg="whiteAlpha.50"
        py={6}
        px={3}
        position="relative"
        display={{ base: conversationId ? "none" : "flex", md: "flex" }}
        >
            {conversationsLoading ?(
                <SkeletonLoader count={7} height="80px" width="360px" />
            ):(
                <ConversationList session={session} conversations={conversationsData?.conversations || []} onViewConversation={onViewConversation}/>
            )}
            
        </Box>
    )
}
export default ConversationWrapper;