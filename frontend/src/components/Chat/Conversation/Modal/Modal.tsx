import { SearchUsersData, SearchUsersInput } from '@/utils/types';
import { useLazyQuery } from '@apollo/client';
import {
    Button, Input, Modal as ModalComponent, ModalBody,
    ModalCloseButton, ModalContent,
    ModalHeader, ModalOverlay, Stack
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import UserOperations from '../../../../graphql/operations/users';

interface ModalProps {
    isOpen:boolean;
    onClose:()=>void;
    session:Session;
};

const Modal:React.FC<ModalProps> = ({isOpen,onClose,session}) => {
    const [username, setUsername] = useState("");
    const [searchUsers,{data,loading,error}] = useLazyQuery<SearchUsersData,SearchUsersInput>(UserOperations.Queries.searchUsers)
    const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        searchUsers({ variables: { username } });
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
                //   isLoading={searchUsersLoading}
                  disabled={!username}
                >
                  Search
                </Button>
              </Stack>
            </form>
          </ModalBody>

          
        </ModalContent>
      </ModalComponent>
    )
}
export default Modal;