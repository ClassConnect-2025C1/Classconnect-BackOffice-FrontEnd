import { Box, VStack, Button, Image, Text, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { MdHome, MdPeople, MdPersonAdd, MdBarChart, MdLogout } from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    // Limpiar el token del localStorage
    localStorage.removeItem("token");
    
    // Mostrar notificación de logout
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });

    // Redirigir al login
    navigate("/login");
  };

  return (
    <Box
      w="250px"
      h="100vh"
      bg="#2F855A" // verde oscuro
      color="white"
      p={5}
      position="fixed"
      display="flex"
      flexDirection="column"
    >
      {/* Logo */}
      <Box mb={10} textAlign="center">
        <Image src={logo} alt="Logo" boxSize="80px" mx="auto" mb={2} />
        <Text fontSize="lg" fontWeight="bold">
          Admin Panel
        </Text>
      </Box>

      {/* Navegación */}
      <VStack spacing={4} align="stretch" flex={1}>
        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: "#276749" }}
          justifyContent="flex-start"
          leftIcon={<MdHome size="20px" />}
          onClick={() => navigate("/home")}
        >
          Home
        </Button>

        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: "#276749" }}
          justifyContent="flex-start"
          leftIcon={<MdPeople size="20px" />}
          onClick={() => navigate("/user-admin")}
        >
          Users
        </Button>

        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: "#276749" }}
          justifyContent="flex-start"
          leftIcon={<MdPersonAdd size="20px" />}
          onClick={() => navigate("/register")}
        >
          Create Admin
        </Button>

        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: "#276749" }}
          justifyContent="flex-start"
          leftIcon={<MdBarChart size="20px" />}
          onClick={() => navigate("/metrics")}
        >
          Metrics
        </Button>
      </VStack>

      {/* Logout button en la parte inferior */}
      <Box mt="auto" pt={4}>
        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: "#C53030", color: "white" }} // rojo al hover
          justifyContent="flex-start"
          leftIcon={<MdLogout size="20px" />}
          onClick={handleLogout}
          width="full"
          borderTop="1px solid"
          borderColor="whiteAlpha.300"
          borderRadius="md"
          pt={4}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;