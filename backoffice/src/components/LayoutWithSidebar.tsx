import { Box, HStack } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const LayoutWithSidebar = () => {
  return (
    <HStack align="start" spacing={0} minH="100vh">
      <Sidebar />
      <Box
        flex="1"
        ml="290px"
        p={10}
        bg="gray.100"
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Outlet />
      </Box>
    </HStack>
  );
};

export default LayoutWithSidebar;
