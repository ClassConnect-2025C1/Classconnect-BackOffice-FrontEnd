import React, { useState, useEffect } from "react";
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
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Text,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  last_name: string;
  email: string;
  role: string;
  is_locked: boolean;
}

const UserAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [changingRoleUserId, setChangingRoleUserId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const toast = useToast();
  
  const usersPerPage = 10;
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  // Verificar autenticación
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "No autorizado",
        description: "Debes iniciar sesión para ver los usuarios",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
      return false;
    }
    return true;
  };

  // Cargar usuarios desde la API
  const fetchUsers = async () => {
    if (!checkAuth()) return;

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      let bearerToken = token;
      if (token && !token.startsWith('Bearer ')) {
        bearerToken = `Bearer ${token}`;
      }

      const response = await fetch(
        "https://classconnect-backoffice-service-api.onrender.com/admin/users_info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": bearerToken || "",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Sesión expirada. Redirigiendo al login...");
        } else if (response.status === 403) {
          throw new Error("No tienes permisos para ver los usuarios");
        } else if (response.status === 404) {
          throw new Error("Endpoint no encontrado - Verifica que el servidor esté activo");
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log("Usuarios cargados:", data);
      
      // La API devuelve una lista de usuarios
      if (Array.isArray(data)) {
        setUsers(data);
        setCurrentPage(1); // Resetear a la primera página
      } else {
        throw new Error("Formato de respuesta inválido");
      }

    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      setError(errorMessage);
      
      if (errorMessage.includes("Sesión expirada")) {
        setTimeout(() => navigate("/login"), 2000);
      }
      
      toast({
        title: "Error al cargar usuarios",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Bloquear/Desbloquear usuario
  const toggleBlock = async (userId: string, currentIsLocked: boolean) => {
    if (!checkAuth()) return;

    setLoadingUserId(userId);

    try {
      const token = localStorage.getItem("token");
      let bearerToken = token;
      if (token && !token.startsWith('Bearer ')) {
        bearerToken = `Bearer ${token}`;
      }

      const toBlock = !currentIsLocked; // Invertir el estado actual
      
      const response = await fetch(
        `https://classconnect-backoffice-service-api.onrender.com/admin/block/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": bearerToken || "",
          },
          body: JSON.stringify({
            to_block: toBlock.toString() // "true" o "false" como string
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Sesión expirada. Redirigiendo al login...");
        } else if (response.status === 403) {
          throw new Error("No tienes permisos para bloquear usuarios");
        } else if (response.status === 404) {
          throw new Error("Usuario no encontrado");
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      // Actualizar el estado local
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, is_locked: toBlock } : user
        )
      );

      const userName = users.find(u => u.id === userId)?.name || "Usuario";
      
      toast({
        title: toBlock ? "Usuario bloqueado" : "Usuario desbloqueado",
        description: `${userName} ha sido ${toBlock ? "bloqueado" : "desbloqueado"} exitosamente`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      if (errorMessage.includes("Sesión expirada")) {
        setTimeout(() => navigate("/login"), 2000);
      }
      
      toast({
        title: "Error al cambiar estado",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingUserId(null);
    }
  };

  // Cambiar rol entre student y teacher
  const changeRole = async (userId: string, currentRole: string) => {
    if (!checkAuth()) return;

    // Solo permitir cambio entre student y teacher
    if (currentRole.toLowerCase() !== 'student' && currentRole.toLowerCase() !== 'teacher') {
      toast({
        title: "Cambio no permitido",
        description: "Solo se puede cambiar el rol entre Student y Teacher",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setChangingRoleUserId(userId);

    try {
      const token = localStorage.getItem("token");
      let bearerToken = token;
      if (token && !token.startsWith('Bearer ')) {
        bearerToken = `Bearer ${token}`;
      }

      // Alternar entre student y teacher
      const newRole = currentRole.toLowerCase() === 'student' ? 'teacher' : 'student';
      
      const response = await fetch(
        `https://classconnect-backoffice-service-api.onrender.com/admin/change_role/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": bearerToken || "",
          },
          body: JSON.stringify({
            rol: newRole
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Sesión expirada. Redirigiendo al login...");
        } else if (response.status === 403) {
          throw new Error("No tienes permisos para cambiar roles");
        } else if (response.status === 404) {
          throw new Error("Usuario no encontrado");
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      // Actualizar el estado local
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      const userName = users.find(u => u.id === userId)?.name || "Usuario";
      
      toast({
        title: "Rol cambiado exitosamente",
        description: `${userName} ahora es ${newRole === 'teacher' ? 'Teacher' : 'Student'}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Error al cambiar rol:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      if (errorMessage.includes("Sesión expirada")) {
        setTimeout(() => navigate("/login"), 2000);
      }
      
      toast({
        title: "Error al cambiar rol",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setChangingRoleUserId(null);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Navegación de páginas
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Obtener color del rol
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'red';
      case 'teacher': return 'blue';
      case 'student': return 'green';
      default: return 'gray';
    }
  };

  if (isLoading) {
    return (
      <Flex minH="100vh" w="100vw" align="center" justify="center" bg="gray.100">
        <Box textAlign="center">
          <Spinner size="xl" color="green.500" mb={4} />
          <Text>Cargando usuarios...</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" w="100vw" align="center" justify="flex-start" bg="gray.100">
      <Box
        p={10}
        minH="100vh"
        bg="gray.50"
        w="full"
        maxW="1200px"
        borderRadius="md"
        boxShadow="lg"
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Heading>Administración de Usuarios</Heading>
          <Button
            colorScheme="green"
            onClick={fetchUsers}
            isLoading={isLoading}
            loadingText="Cargando..."
          >
            Actualizar
          </Button>
        </Flex>

        {error && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {users.length === 0 && !isLoading && !error && (
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            <AlertDescription>No se encontraron usuarios</AlertDescription>
          </Alert>
        )}

        {users.length > 0 && (
          <>
            <Table variant="simple" bg="white" borderRadius="md" boxShadow="md" mb={6}>
              <Thead bg="gray.100">
                <Tr>
                  <Th>Nombre</Th>
                  <Th>Apellido</Th>
                  <Th>Email</Th>
                  <Th>Rol</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td fontWeight="medium">{user.name}</Td>
                    <Td>{user.last_name}</Td>
                    <Td color="gray.600">{user.email}</Td>
                    <Td>
                      <Badge colorScheme={getRoleColor(user.role)} variant="subtle">
                        {user.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={user.is_locked ? "red" : "green"} 
                        variant="solid"
                      >
                        {user.is_locked ? "Bloqueado" : "Activo"}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          colorScheme={user.is_locked ? "green" : "red"}
                          size="sm"
                          onClick={() => toggleBlock(user.id, user.is_locked)}
                          isLoading={loadingUserId === user.id}
                          loadingText={user.is_locked ? "Desbloqueando..." : "Bloqueando..."}
                        >
                          {user.is_locked ? "Desbloquear" : "Bloquear"}
                        </Button>
                        
                        {/* Botón de cambio de rol solo para student y teacher */}
                        {(user.role.toLowerCase() === 'student' || user.role.toLowerCase() === 'teacher') && (
                          <Button
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            onClick={() => changeRole(user.id, user.role)}
                            isLoading={changingRoleUserId === user.id}
                            loadingText="Cambiando..."
                          >
                            {user.role.toLowerCase() === 'student' ? 'Make Teacher' : 'Make Student'}
                          </Button>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* Paginación */}
            {totalPages > 1 && (
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, users.length)} de {users.length} usuarios
                </Text>
                
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Página anterior"
                    icon={<MdChevronLeft size="20px" />}
                    size="sm"
                    onClick={goToPrevPage}
                    isDisabled={currentPage === 1}
                  />
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={currentPage === page ? "solid" : "outline"}
                      colorScheme={currentPage === page ? "green" : "gray"}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <IconButton
                    aria-label="Página siguiente"
                    icon={<MdChevronRight size="20px" />}
                    size="sm"
                    onClick={goToNextPage}
                    isDisabled={currentPage === totalPages}
                  />
                </HStack>
              </Flex>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

export default UserAdmin;