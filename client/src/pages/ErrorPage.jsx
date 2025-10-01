import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function ErrorPage() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const statusText = isRouteErrorResponse(error) ? error.statusText : 'Unexpected Error';

  return (
    <Layout>
      <Container maxW="lg" py={16}>
        <Heading mb={3} letterSpacing="-0.02em">{status} {statusText}</Heading>
        <Text color="gray.600" mb={6}>
          Something went wrong while loading this page. You can go back home or try again.
        </Text>
        <Box>
          <Button as={Link} to="/" colorScheme="blue" mr={3}>Go Home</Button>
          <Button onClick={() => location.reload()}>Reload</Button>
        </Box>
      </Container>
    </Layout>
  );
}


