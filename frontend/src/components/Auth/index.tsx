import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import React, {useState} from 'react';

type authProps = {
    session : Session | null,
    reloadSession :()=>void
};

const Auth:React.FC<authProps> = ({session,reloadSession}) => {
    const [username, setUsername] = useState("");
    const onSubmit = ()=>{}
    
    return (
        <Center height="100vh">
            <Stack spacing={8} align="center">
                {session ?(
                <>
                <Text fontSize="3xl">Create a Username</Text>
                <Input
                 placeholder="Enter a username"
                 value={username}
                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>setUsername(event.target.value)}
                />
                <Button onClick={onSubmit} width="100%">Submit</Button>
                </>
                )
                :(
                <>
                <Image height={100} src="/images/logo.png" alt='app-logo'/>
                {/* <Text fontSize="4xl">MessengerQL</Text>
                <Text width="70%" align="center">Sign in with Google to send unlimited free messages to your friends</Text> */}
                <Button onClick={() => signIn("google")}leftIcon={<Image height="20px" src="/images/google-logo.png" alt='google-signin'/>}>
                  Continue with Google
                </Button>
                </>
                )}
            </Stack>
        </Center>
    )
}
export default Auth;