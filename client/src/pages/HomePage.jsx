import { Box, Button, Container, Heading, Stack, Text, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function HomePage() {
  return (
    <Layout mainProps={{ bgGradient: 'linear(to-b, white, gray.50)' }}>
      <Box py={{ base: 16, md: 24 }}>
        <Container>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={12} align="center">
            <Stack spacing={6} maxW="xl">
              <Heading size="2xl" letterSpacing="-0.04em" lineHeight={1.05}>
                Organize your library with effortless elegance
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600">
                A minimalist book manager inspired by the clarity and polish of Apple design.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button as={Link} to="/books" colorScheme="blue" size="lg">
                  View Books
                </Button>
                <Button as={Link} to="/auth" variant="outline" size="lg">
                  Sign in / Register
                </Button>
              </Stack>
            </Stack>
            <Box shadow="soft" rounded="2xl" overflow="hidden">
              <Image src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop" alt="Books hero" maxW={{ base: '100%', md: '520px' }} />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Layout>
  );
}


