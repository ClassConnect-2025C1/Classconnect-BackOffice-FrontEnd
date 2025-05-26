import React from "react";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
} from "@chakra-ui/react";
import {
  MdBlock,
  MdGroup,
  MdSupervisorAccount,
  MdCoffee,
  MdSupport,
  MdPets,
} from "react-icons/md";

const MetricsScreen: React.FC = () => {
  return (
    <Flex minH="100vh" w="100vw" align="flex-start" justify="flex-start" bg="gray.100" p={10}>
      <Box bg="white" borderRadius="md" boxShadow="lg" p={8} w="full" maxW="1000px">
        <Heading mb={6}>📊 Métricas del Sistema</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <MetricCard label="Usuarios Registrados" value={1287} icon={MdGroup} color="blue.500" />
          <MetricCard label="Usuarios Bloqueados" value={34} icon={MdBlock} color="red.400" />
          <MetricCard label="Admins Activos" value={5} icon={MdSupervisorAccount} color="green.500" />
          <MetricCard label="Tazas de Café Consumidas" value={9821} icon={MdCoffee} color="orange.400" />
          <MetricCard label="Tickets de Soporte Resueltos" value={412} icon={MdSupport} color="purple.500" />
          <MetricCard label="Gatos que Interrumpieron Reuniones" value={17} icon={MdPets} color="pink.400" />
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, color }) => (
  <Stat
    p={4}
    borderWidth="1px"
    borderRadius="md"
    bg="gray.50"
    boxShadow="sm"
    _hover={{ boxShadow: "md" }}
  >
    <Flex align="center" gap={3}>
      <Icon as={icon} w={8} h={8} color={color} />
      <Box>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{value}</StatNumber>
        <StatHelpText>Últimos 30 días</StatHelpText>
      </Box>
    </Flex>
  </Stat>
);

export default MetricsScreen;
