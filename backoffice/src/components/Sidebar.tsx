// components/Sidebar.tsx
import { Box, VStack, Button, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box
      w="250px"
      h="100vh"
      bg="#2F855A" // verde oscuro
      color="white"
      p={5}
      position="fixed"
    >
      {/* Logo */}
   <Box mb={10} textAlign="center">
  <Image
    src={logo}
    alt="Logo"
    boxSize="80px"
    mx="auto"
    mb={2}
  />
  <Text fontSize="lg" fontWeight="bold">
    Admin Panel
  </Text>
</Box>

      {/* Navegación */}
      <VStack spacing={4} align="stretch">
        <Button variant="ghost" color="white" _hover={{ bg: "#276749" }} onClick={() => navigate("/")}>
          Home
        </Button>
        <Button variant="ghost" color="white" _hover={{ bg: "#276749" }} onClick={() => navigate("/user-admin")}>
          Users
        </Button>
        <Button variant="ghost" color="white" _hover={{ bg: "#276749" }} onClick={() => navigate("/create-admin")}>
          Create Admin
        </Button>
        <Button variant="ghost" color="white" _hover={{ bg: "#276749" }} onClick={() => navigate("/metrics")}>
          Metrics
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
