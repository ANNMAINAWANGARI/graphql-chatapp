import { CreateConversationData, CreateConversationInput, SearchedUsers, SearchUsersData, SearchUsersInput } from '@/utils/types';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
    Button, Input, Modal as ModalComponent, ModalBody,
    ModalCloseButton, ModalContent,
    ModalHeader, ModalOverlay, Stack
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import UserOperations from '../../../../graphql/operations/users';
import Participants from './Participants';
import UserSearchList from './UserSearchList';
import ConversationOperations from '../../../../graphql/operations/conversation'
import { useRouter, useSearchParams } from 'next/navigation';


interface ModalProps {
    isOpen:boolean;
    onClose:()=>void;
    session:Session;
    
};

const Modal:React.FC<ModalProps> = ({isOpen,onClose,session}) => {
  const router = useRouter()
    const searchParams = useSearchParams();
    const [username, setUsername] = useState("");
    const [searchUsers,{data,loading}] = useLazyQuery<SearchUsersData,SearchUsersInput>(UserOperations.Queries.searchUsers)
    const [createConversation,{loading:createConversationLoading}] =useMutation<CreateConversationData,CreateConversationInput>(ConversationOperations.Mutations.createConversation)
    const [participants,setParticipants] = useState<Array<SearchedUsers>>([])
    const {
      user: { id: userId },
    } = session;
    
    // functions
    const onSearch = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
         let {error} =await searchUsers({ variables: { username } });
         if(error)throw new Error('Error searching for the username')
        }catch(error:any){
          toast.error(error?.message)
        }
        //console.log(data,'dataaaaa')
      };
    const addParticipant = (user:SearchedUsers)=>{
      setParticipants((prev)=>{return [...prev,user]})
    };
    const removeParticipant = (userId: string) => {
      setParticipants((prev) => prev.filter((u) => u.id !== userId));
    };
    const onCreateConversation = async()=>{
      const participantIds = [userId,...participants.map((p) => p.id)];
      try{
        const {data,errors} = await createConversation({variables: {
          participantIds,
        },})
        if (!data?.createConversation || errors) {
          throw new Error("Failed to create conversation");
        }
        const {createConversation: { conversationId },} = data;
        router.push(`/?conversationId=${conversationId}`)
        
        /**
         * Clear state and close modal
         * on successful creation
         */
        setParticipants([]);
        setUsername("");
        onClose()
      }catch(error:any){
        toast.error(error?.message)
      }
    }
    return (
        <ModalComponent isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent  bg="#2d2d2d" pb={4}>
          <ModalHeader>Find or Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
              <Input
                  placeholder="Enter a username"
                  onChange={(event) => setUsername(event.target.value)}
                  value={username}
                />
                <Button
                  width="100%"
                  type="submit"
                  isLoading={loading}
                  disabled={!username}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && <UserSearchList users={data.searchUsers} addParticipant={addParticipant}/>}
           { participants.length !== 0 && 
           <>
            <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
            />
            <Button
             bg="brand.100"
             _hover={{ bg: "brand.100" }}
             width="100%"
             mt={6}
             isLoading={createConversationLoading}
             onClick={onCreateConversation}>Create Conversation</Button>
           </>}
          </ModalBody>

          
        </ModalContent>
      </ModalComponent>
    )
}
export default Modal;