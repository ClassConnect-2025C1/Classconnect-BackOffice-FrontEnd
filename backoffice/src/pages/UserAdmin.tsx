import React, { useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Flex,
} from "@chakra-ui/react";

import Sidebar from "../components/Sidebar";

interface User {
  id: number;
  name: string;
  email: string;
  isBlocked: boolean;
}

const mockUsers: User[] = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com", isBlocked: false },
  { id: 2, name: "Ana Gómez", email: "ana@example.com", isBlocked: true },
  { id: 3, name: "Carlos Ruiz", email: "carlos@example.com", isBlocked: false },
];

const UserAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const toast = useToast();

  const toggleBlock = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isBlocked: !user.isBlocked } : user,
      ),
    );
    const user = users.find((u) => u.id === id);
    toast({
      title: user?.isBlocked ? "Usuario desbloqueado" : "Usuario bloqueado",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Flex>
      <Sidebar />
      <Box ml="250px" p={10} minH="100vh" bg="gray.50" w="full">
        <Heading mb={6}>Administración de Usuarios</Heading>
        <Table variant="simple" bg="white" borderRadius="md" boxShadow="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.isBlocked ? "Bloqueado" : "Activo"}</Td>
                <Td>
                  <Button
                    colorScheme={user.isBlocked ? "green" : "red"}
                    size="sm"
                    onClick={() => toggleBlock(user.id)}
                  >
                    {user.isBlocked ? "Desbloquear" : "Bloquear"}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
};

export default UserAdmin;
