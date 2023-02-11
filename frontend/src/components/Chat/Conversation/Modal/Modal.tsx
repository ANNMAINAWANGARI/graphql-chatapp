import { SearchedUsers, SearchUsersData, SearchUsersInput } from '@/utils/types';
import { useLazyQuery } from '@apollo/client';
import {
    Button, Input, Modal as ModalComponent, ModalBody,
    ModalCloseButton, ModalContent,
    ModalHeader, ModalOverlay, Stack
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import UserOperations from '../../../../graphql/operations/users';
import Participants from './Participants';
import UserSearchList from './UserSearchList';

interface ModalProps {
    isOpen:boolean;
    onClose:()=>void;
    session:Session;
};

const Modal:React.FC<ModalProps> = ({isOpen,onClose,session}) => {
    const [username, setUsername] = useState("");
    const [searchUsers,{data,loading,error}] = useLazyQuery<SearchUsersData,SearchUsersInput>(UserOperations.Queries.searchUsers)
    const [participants,setParticipants] = useState<Array<SearchedUsers>>([])
    // functions
    const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        searchUsers({ variables: { username } });
      };
    const addParticipant = (user:SearchedUsers)=>{
      setParticipants((prev)=>{return [...prev,user]})
    };
    const removeParticipant = (userId: string) => {
      setParticipants((prev) => prev.filter((u) => u.id !== userId));
    };
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
           </>}
          </ModalBody>

          
        </ModalContent>
      </ModalComponent>
    )
}
export default Modal;