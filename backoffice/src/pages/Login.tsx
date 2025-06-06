import React, { useState } from "react";
import {
  Box,
  Button,
  Image,
  Input,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");


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
    setLoginError(""); // Limpiar errores previos
    
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://classconnect-backoffice-service-api.onrender.com/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Credenciales inválidas");
        } else if (response.status === 404) {
          throw new Error("Endpoint no encontrado - Verifica que el servidor esté activo");
        } else if (response.status === 500) {
          throw new Error("Error interno del servidor");
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      // Obtener datos del body
      const data = await response.json();

      // Buscar el token en diferentes lugares
      let token = null;

      // 1. Buscar en header Authorization
      const tokenFromHeader = response.headers.get("Authorization");
      if (tokenFromHeader) {
        token = tokenFromHeader;
      }
      // 2. Buscar en header authorization (minúscula)
      else {
        const tokenFromAuth = response.headers.get("authorization");
        if (tokenFromAuth) {
          token = tokenFromAuth;
        }
        // 3. Buscar en el body
        else if (data.token) {
          token = data.token;
        }
        else if (data.accessToken) {
          token = data.accessToken;
        }
        else if (data.access_token) {
          token = data.access_token;
        }
        else if (data.authToken) {
          token = data.authToken;
        }
        else if (data.jwt) {
          token = data.jwt;
        }
        // 4. Buscar en data.data (por si está anidado)
        else if (data.data && data.data.token) {
          token = data.data.token;
        }
        // 5. Buscar en data.user (por si está en el objeto user)
        else if (data.user && data.user.token) {
          token = data.user.token;
        }
      }

      if (token) {
        // Asegurar que el token tenga el formato Bearer si no lo tiene
        const finalToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        localStorage.setItem("token", finalToken);
        console.log("Token guardado exitosamente");
      }

      // Mostrar notificación de éxito
      toast({
        title: "Login exitoso",
        description: "Bienvenido al panel de administración",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      // Ejecutar callback si se proporciona
      if (onSubmit) {
        onSubmit({ email, password });
      }

      // Redirigir al home después de un breve delay
      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (error) {
      console.error("Error en login:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      if (errorMessage.includes("Credenciales inválidas")) {
        setLoginError("Las credenciales ingresadas no son válidas");
        onOpen(); // Mostrar modal de error
      } else if (errorMessage.includes("Endpoint no encontrado")) {
        setLoginError("El servidor no está disponible o el endpoint no existe");
        toast({
          title: "Servidor no disponible",
          description: "El servidor puede estar inactivo. Los servicios gratuitos de Render se duermen después de inactividad.",
          status: "error",
          duration: 8000,
          isClosable: true,
          position: "top-right",
        });
      } else if (errorMessage.includes("Failed to fetch")) {
        setLoginError("Error de conexión. Verifica tu conexión a internet.");
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        setLoginError(errorMessage);
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

  return (
    <Flex minH="100vh" w="100vw" align="center" justify="center" bg="gray.100">
      <Box w="600px" bg="white" p={10} borderRadius="lg" boxShadow="xl">
        <Flex justify="center" mb={6}>
          <Image
            src={logo}
            alt="Logo"
            boxSize="120px"
            objectFit="contain"
            fallback={<Box boxSize="120px" bg="gray.200" borderRadius="md" />}
          />
        </Flex>

        <Heading size="lg" textAlign="center" mb={2}>
          Admin Login
        </Heading>
        <Text textAlign="center" color="gray.600" fontSize="md" mb={6}>
          Please enter your credentials
        </Text>

        {/* Mostrar error general si existe */}
        {loginError && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            <AlertDescription>{loginError}</AlertDescription>
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
                  if (loginError) setLoginError(""); // Limpiar error de login
                }}
                bg="gray.50"
                borderColor="gray.300"
                _focus={{
                  borderColor: "#4CAF50",
                  boxShadow: "0 0 0 1px #4CAF50",
                }}
                aria-describedby={emailError ? "email-error" : undefined}
                disabled={isLoading}
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
                  if (loginError) setLoginError(""); // Limpiar error de login
                }}
                bg="gray.50"
                borderColor="gray.300"
                _focus={{
                  borderColor: "#4CAF50",
                  boxShadow: "0 0 0 1px #4CAF50",
                }}
                aria-describedby={passwordError ? "password-error" : undefined}
                disabled={isLoading}
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
              loadingText="Iniciando sesión..."
              disabled={isLoading}
            >
              Log in
            </Button>

          </VStack>
        </form>
      </Box>

      {/* Modal de error de autenticación */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error de autenticación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3}>Las credenciales ingresadas no son válidas.</Text>
            <Text fontSize="sm" color="gray.600">
              Verifica que tu correo electrónico y contraseña sean correctos.
              <br />
              <br />
              <strong>Credenciales de prueba:</strong>
              <br />
              Email: admin@example.com
              <br />
              Password: admin1234
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cerrar
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default LoginForm;