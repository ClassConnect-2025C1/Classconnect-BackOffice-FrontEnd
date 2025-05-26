import { Box, Heading, Text, VStack, HStack, Icon,Flex } from "@chakra-ui/react";
import { MdDashboard, MdPeople, MdPersonAdd, MdBarChart } from "react-icons/md";

const Home = () => {
  return (
    <Flex minH="100vh" w="100vw" align="center" justify="center" bg="gray.100">
      <Box p={10} bg="gray.100" height="100%" width="150%">
        <Heading mb={6}>Welcome back!</Heading>
        <Text fontSize="lg" mb={8} color="gray.700">
          Here is a quick overview of what you can do!:
        </Text>

        <VStack
          spacing={6}
          align="start"
          maxW="700px"
          bg="white"
          p={6}
          borderRadius="md"
          boxShadow="md"
        >
          <HStack spacing={4}>
            <Icon as={MdDashboard} w={22} h={8} color="green.500" />
            <Text>You can view and manage your dashboard.</Text>
          </HStack>

          <HStack spacing={4}>
            <Icon as={MdPeople} w={8} h={8} color="green.500" />
            <Text>Manage users and their roles easily.</Text>
          </HStack>

          <HStack spacing={4}>
            <Icon as={MdPersonAdd} w={8} h={8} color="green.500" />
            <Text>Create new admins to help manage the platform.</Text>
          </HStack>

          <HStack spacing={4}>
            <Icon as={MdBarChart} w={8} h={8} color="green.500" />
            <Text>Analyze metrics and gain insights.</Text>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Home;
