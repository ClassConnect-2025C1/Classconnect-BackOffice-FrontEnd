import React, { useState } from "react";
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
} from "@chakra-ui/react";

interface RegisterProps {
  onSubmit: (data: { email: string; password: string }) => void;
}

const Register: React.FC<RegisterProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email, password });
    }
  };

  return (
    <Flex minH="90vh" w="75vw" align="center" justify="center" bg="gray.100">
      <Box w="600px" bg="white" p={10} borderRadius="lg" boxShadow="xl">
        <Heading size="lg" textAlign="center" mb={2}>
          Register
        </Heading>
        <Text textAlign="center" color="gray.600" fontSize="md" mb={6}>
          Please enter new admin credentials
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormControl isInvalid={!!emailError} isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                bg="gray.50"
                borderColor="gray.300"
                _focus={{
                  borderColor: "#4CAF50",
                  boxShadow: "0 0 0 1px #4CAF50",
                }}
                aria-describedby={emailError ? "email-error" : undefined}
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
                }}
                bg="gray.50"
                borderColor="gray.300"
                _focus={{
                  borderColor: "#4CAF50",
                  boxShadow: "0 0 0 1px #4CAF50",
                }}
                aria-describedby={passwordError ? "password-error" : undefined}
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
            >
              Create Admin
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;
