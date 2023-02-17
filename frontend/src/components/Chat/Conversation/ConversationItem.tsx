
import React, { useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { ConversationPopulated } from '../../../../../backend/src/utils/types';
import {
    Avatar,
    Box,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    Stack,
    Text,
  } from "@chakra-ui/react";

type ConversationItemProps = {
    conversation:ConversationPopulated
    
};

const ConversationItem:React.FC<ConversationItemProps> = ({conversation}) => {
    
    return (
        <Stack
        direction="row"
        align="center"
        justify="space-between"
        p={4}
        cursor="pointer"
        borderRadius={4}
        _hover={{ bg: "whiteAlpha.200" }}
        bg= "whiteAlpha.200"
        position="relative">
            <Text>{conversation.id}</Text>
        </Stack>
    )
}
export default ConversationItem;