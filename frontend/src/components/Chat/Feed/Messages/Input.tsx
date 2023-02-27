import { Box,Button,Input } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React,{useState} from 'react';
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import MessageOperations from "../../../../graphql/operations/messages";
import { MessagesData, SendMessageVariables } from '@/utils/types';
import {  ObjectID } from 'bson';
import { SendMessageArguments } from '../../../../../../backend/src/utils/types';


type InputProps = {
    session:Session
    conversationId: string;
};

const MessageInput:React.FC<InputProps> = ({session,conversationId}) => {
  
    const [messageBody, setMessageBody] = useState("");
    const [sendMessage] = useMutation<{ sendMessage: boolean }, SendMessageArguments>(MessageOperations.Mutations.sendMessage)
    const onSendMessage = async(e:React.FormEvent)=>{
      e.preventDefault()
      
       try{
       const { id: senderId } = session.user;
       const newId = new ObjectID().toString();
       const newMessage: SendMessageArguments = {
         id:newId,
         senderId,
         conversationId,
         body: messageBody,
       };
       setMessageBody('')
       const { data, errors } = await sendMessage({
         variables: {
           ...newMessage,
         },
         optimisticResponse: {
					sendMessage: true,
				},
        update:(cache)=>{
          const existingMessages = cache.readQuery<MessagesData>({
						query: MessageOperations.Query.messages,
						variables: {
							conversationId,
						},
					}) as MessagesData;
          cache.writeQuery<MessagesData, { conversationId: string }>({
						query: MessageOperations.Query.messages,
						variables: {
							conversationId,
						},
						data: {
							...existingMessages,
							messages: [
								{
									id: newId,
									body: messageBody,
									senderId: session.user.id,
									conversationId,
									sender: {
										id: session.user.id,
										username: session.user.username,
									},
									createdAt: new Date(Date.now()),
									updatedAt: new Date(Date.now()),
								},
								...(existingMessages?.messages || []),
							],
						},
					});
        }
        })
        
        // console.log('inputdata',data)
         if (!data?.sendMessage || errors) {
           throw new Error("Error sending message");
         }
       }catch(error:any){
         //console.log("onSendMessage error", error);
         toast.error(error?.message);
       }
    }
    return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={onSendMessage} style={{display:'flex', gap:'2px'}}>
        <Input
          value={messageBody}
          onChange={(event) => setMessageBody(event.target.value)}
          size="md"
          placeholder="New message"
          color="whiteAlpha.900"
          resize="none"
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "whiteAlpha.300",
          }}
          _hover={{
            borderColor: "whiteAlpha.300",
          }}
        />
        <Button type='submit'>Send</Button>
      </form>
    </Box>
    )
}
export default MessageInput;