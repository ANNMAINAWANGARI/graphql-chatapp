
import { CreateUsernameData, CreateUsernameVariables } from '@/utils/types';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import React, {useState} from 'react';
import { toast } from 'react-hot-toast';
import Operations from '../../graphql/operations/users'

type authProps = {
    session : Session | null,
    reloadSession :()=>void
};


const Auth:React.FC<authProps> = ({session,reloadSession}) => {
    const [username, setUsername] = useState("");
    const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,CreateUsernameVariables>(Operations.Mutations.createUsername);

    console.log('data',loading,error)
    const onSubmit = async()=>{
        if(!username)return;
        try{ 
          const {data} = await createUsername({ variables: { username: username } });
           if (!data?.createUsername) {
            throw new Error();
          }
          if (data.createUsername.error) {
            const {
              createUsername: { error },
            } = data;
           throw new Error()
            
          }
          toast.success("Username successfully created");
          console.log('success')
          /**
       * Reload session to obtain new username
       */
      reloadSession();
        }catch(error:any){
            toast.error("There was an error")
            console.log('CreateUsernameError',error)
        }
    }
    
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
                <Button onClick={onSubmit} width="100%" isLoading={loading}>Submit</Button>
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