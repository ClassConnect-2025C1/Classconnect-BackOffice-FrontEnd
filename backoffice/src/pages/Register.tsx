import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface RegisterProps {
  onSubmit?: (data: { email: string; password: string }) => void;
}

const Register: React.FC<RegisterProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    // Verificar autenticación al montar el componente
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setAuthStatus(!!token);
    };

    checkAuth();
    
    // Verificar cada segundo por si cambia el token
    const interval = setInterval(checkAuth, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Email is invalid");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(""); // Limpiar errores previos
    
    if (!validate()) {
      return;
    }

    // Verificar que existe un token de autorización
    const token = localStorage.getItem("token");
    
    if (!token) {
      setRegisterError("No estás autorizado. Debes iniciar sesión primero.");
      toast({
        title: "Sin autorización",
        description: "Debes iniciar sesión para registrar nuevos administradores",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Asegurar que el token tenga el formato correcto
      let bearerToken = token;
      if (!token.startsWith('Bearer ')) {
        bearerToken = `Bearer ${token}`;
      }
      
      const response = await fetch("https://classconnect-backoffice-service-api.onrender.com/admin/register", {
        method: "POST",
        headers: {
          "Authorization": bearerToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Token de autorización inválido o expirado");
        } else if (response.status === 403) {
          throw new Error("No tienes permisos para registrar administradores");
        } else if (response.status === 409) {
          throw new Error("Ya existe un administrador con este email");
        } else if (response.status === 404) {
          throw new Error("Endpoint no encontrado - Verifica que el servidor esté activo");
        } else if (response.status === 500) {
          throw new Error("Error interno del servidor");
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      // Obtener datos de respuesta si los hay
      const data = await response.json();
      console.log("Administrador registrado exitosamente");

      // Mostrar notificación de éxito
      toast({
        title: "Administrador creado",
        description: `El administrador ${email} ha sido registrado exitosamente`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      // Ejecutar callback si se proporciona
      if (onSubmit) {
        onSubmit({ email, password });
      }

      // Limpiar el formulario
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error("Error en registro:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      if (errorMessage.includes("Token de autorización inválido")) {
        setRegisterError("Tu sesión ha expirado. Inicia sesión nuevamente.");
        toast({
          title: "Sesión expirada",
          description: "Tu token de autorización ha expirado. Redirigiendo al login...",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        // Limpiar token y redirigir al login
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else if (errorMessage.includes("Ya existe un administrador")) {
        setRegisterError("Ya existe un administrador con este email");
        onOpen(); // Mostrar modal de error
      } else if (errorMessage.includes("Endpoint no encontrado")) {
        setRegisterError("El servidor no está disponible o el endpoint no existe");
        toast({
          title: "Servidor no disponible",
          description: "El servidor puede estar inactivo. Los servicios gratuitos de Render se duermen después de inactividad.",
          status: "error",
          duration: 8000,
          isClosable: true,
          position: "top-right",
        });
      } else if (errorMessage.includes("Failed to fetch")) {
        setRegisterError("Error de conexión. Verifica tu conexión a internet.");
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        setRegisterError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para probar con credenciales de ejemplo
  const handleTestData = () => {
    setEmail("admin3@example.com");
    setPassword("admin1234");
  };

  return (
    <Flex minH="90vh" w="75vw" align="center" justify="center" bg="gray.100">
      <Box w="600px" bg="white" p={10} borderRadius="lg" boxShadow="xl">
        <Heading size="lg" textAlign="center" mb={2}>
          Register Admin
        </Heading>
        <Text textAlign="center" color="gray.600" fontSize="md" mb={6}>
          Create a new administrator account
        </Text>

        {/* Mostrar alerta si no está autenticado */}
        {!authStatus && (
          <Alert status="warning" mb={4} borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              Necesitas estar autenticado para registrar nuevos administradores.
              <Button 
                ml={2} 
                size="sm" 
                colorScheme="orange" 
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Ir al Login
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Mostrar error general si existe */}
        {registerError && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            <AlertDescription>{registerError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormControl isInvalid={!!emailError} isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                  if (registerError) setRegisterError(""); // Limpiar error de registro
                }}
                bg="gray.50"
                borderColor="gray.300"
                _focus={{
                  borderColor: "#4CAF50",
                  boxShadow: "0 0 0 1px #4CAF50",
                }}
                aria-describedby={emailError ? "email-error" : undefined}
                disabled={isLoading || !authStatus}
              />
              <FormErrorMessage id="email-error">{emailError}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!passwordError} isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                  if (registerError) setRegisterError(""); // Limpiar error de registro
                }}
                bg="gray.50"
                borderColor="gray.300"
                _focus={{
                  borderColor: "#4CAF50",
                  boxShadow: "0 0 0 1px #4CAF50",
                }}
                aria-describedby={passwordError ? "password-error" : undefined}
                disabled={isLoading || !authStatus}
              />
              <FormErrorMessage id="password-error">
                {passwordError}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="green"
              size="lg"
              width="full"
              fontWeight="bold"
              isLoading={isLoading}
              loadingText="Creando administrador..."
              disabled={isLoading || !authStatus}
            >
              Create Admin
            </Button>

            {/* Botón para datos de prueba */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestData}
              disabled={isLoading || !authStatus}
              colorScheme="gray"
            >
              Usar datos de ejemplo
            </Button>

            {/* Botón para ir al login si no está autenticado */}
            {!authStatus && (
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Ir al Login
              </Button>
            )}
          </VStack>
        </form>
      </Box>

      {/* Modal de error */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error en el registro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3}>{registerError}</Text>
            {registerError.includes("Ya existe un administrador") && (
              <Text fontSize="sm" color="gray.600">
                Intenta con un email diferente o verifica si el administrador ya fue creado.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cerrar
            </Button>
            {registerError.includes("Ya existe un administrador") && (
              <Button variant="outline" onClick={() => { setEmail(""); onClose(); }}>
                Limpiar email
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Register;