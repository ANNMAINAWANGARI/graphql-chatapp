import React from 'react';
import { Button, Stack, Text } from "@chakra-ui/react";

type HeaderProps = {
    userId: string;
    conversationId: string;
};

const Header:React.FC<HeaderProps> = () => {
    
    return(
        <Stack
        direction="row"
        align="center"
        spacing={6}
        py={5}
        px={{ base: 4, md: 0 }}
        borderBottom="1px solid"
        borderColor="whiteAlpha.200">
            <Button display={{ md: "none" }}>Back</Button>
        </Stack>
    )
}
export default Header;