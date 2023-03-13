import { gql, useMutation, useQuery,useSubscription } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React,{useEffect} from 'react';
import ConversationList from './ConversationList';
import ConversationOperations from '../../../graphql/operations/conversation'
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { ConversationCreatedSubscriptionData, ConversationsData, ConversationUpdatedData } from '@/utils/types';
import { ConversationPopulated, ParticipantPopulated } from '../../../../../backend/src/utils/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface ConversationWrapperProps  {
    session:Session
};

const ConversationWrapper:React.FC<ConversationWrapperProps> = ({session}) => {
    const {
        user: { id: userId },
      } = session;
    const router = useRouter()
    const searchParams = useSearchParams();
    const conversationId = searchParams.get('conversationId');
    //https://github.com/apollographql/apollo-client/blob/main/src/core/ApolloClient.ts#L314
    //https://www.apollographql.com/docs/react/data/queries
    //https://www.apollographql.com/docs/react/api/core/ApolloClient#ApolloClient.query
    const {
      data:conversationsData,
      error:conversationsError,
      loading:conversationsLoading,subscribeToMore} = useQuery<ConversationsData,any>(ConversationOperations.Queries.conversations,{variables:null})
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
    const [markConversationAsRead] = useMutation<{ markConversationAsRead: boolean },{ userId: string; conversationId: string }>(ConversationOperations.Mutations.markConversationAsRead);

    const onViewConversation = async(conversationId:string, hasSeenLatestMessage: boolean | undefined)=>{
        // Push the conversationId to the router query params
        //console.log('clicked')
        router.push(`/?conversationId=${conversationId}`)
        // Mark conversation as read
        if (hasSeenLatestMessage) return;
        try{
            await markConversationAsRead({
                variables: {
                  userId,
                  conversationId,
                },
                optimisticResponse: {
                  markConversationAsRead: true,
                },
              update:(cache)=>{
                  /*** Get conversation participants from cache*/
                  const participantsFragment = cache.readFragment<{
                    participants: Array<ParticipantPopulated>;
                  }>({
                    id: `Conversation:${conversationId}`,
                    fragment: gql`
                      fragment Participants on Conversation {
                        participants {
                          user {
                            id
                            username
                          }
                          hasSeenLatestMessage
                        }
                      }
                    `,
                  })
                  if (!participantsFragment) return;

                  const participants = [...participantsFragment.participants];
        
                  const userParticipantIdx = participants.findIndex(
                    (p) => p.user.id === userId
                  );
        
                  if (userParticipantIdx === -1) return;
        
                  const userParticipant = participants[userParticipantIdx];
        
                  /**
                   * Update participant to show latest message as read
                   */
                  participants[userParticipantIdx] = {
                    ...userParticipant,
                    hasSeenLatestMessage: true,
                  };
        
                  /**
                   * Update cache
                   */
                  cache.writeFragment({
                    id: `Conversation:${conversationId}`,
                    fragment: gql`
                      fragment UpdatedParticipant on Conversation {
                        participants
                      }
                    `,
                    data: {
                      participants,
                    },
                  });
                
              }})
        }catch(err:any){
            console.log('hasSeenLastMessageError',err)
            toast.error(err)
        }
    }
    useSubscription<ConversationUpdatedData, any>(
      ConversationOperations.Subscriptions.conversationUpdated,
      {
        onData: ({ client, data }) => {
          const { data: subscriptionData } = data;
          console.log('data firing',subscriptionData)
          if (!subscriptionData) return;
  
          const {
            conversationUpdated: { conversation: updatedConversation },
          } = subscriptionData;
  
          const currentlyViewingConversation =
            updatedConversation.id === conversationId;
  
          if (currentlyViewingConversation) {
            onViewConversation(conversationId, false);
          }
        },
      }
    );
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