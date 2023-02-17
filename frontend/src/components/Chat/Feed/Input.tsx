import { Box,Input } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React,{useState} from 'react';

type InputProps = {
    session:Session
    conversationId: string;
};

const MessageInput:React.FC<InputProps> = () => {
    const [messageBody, setMessageBody] = useState("");
    const onSendMessage = ()=>{}
    return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={onSendMessage}>
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
      </form>
    </Box>
    )
}
export default MessageInput;