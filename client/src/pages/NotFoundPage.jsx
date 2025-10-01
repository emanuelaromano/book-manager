import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function NotFoundPage() {
  return (
    <Layout>
      <Container maxW="lg" py={16}>
        <Heading mb={3} letterSpacing="-0.02em">404 Not Found</Heading>
        <Text color="gray.600" mb={6}>
          The page you are looking for doesn’t exist or has been moved.
        </Text>
        <Box>
          <Button as={Link} to="/" colorScheme="blue">Go Home</Button>
        </Box>
      </Container>
    </Layout>
  );
}


