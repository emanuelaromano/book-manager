import { Box, Button, Container, Heading, Stack, Text, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import handWriting from '../assets/hand_writing.png';

export default function HomePage() {
  return (
    <Layout>
      <Box py={{ base: 18, md: 28 }}>
        <Container>
          <Stack spacing={6} align="center" textAlign="center">
            <Heading size="2xl" letterSpacing="-0.04em" lineHeight={1.05}>
              Your library, simply organized
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" maxW="2xl">
              A minimalist book manager inspired by Notion’s calm, focused workspace.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button as={Link} to="/books" size="lg">
                View Books
              </Button>
              <Button as={Link} to="/auth" variant="ghost" size="lg">
                Sign in / Register
              </Button>
            </Stack>
            <Box pt={{ base: 8, md: 10 }} w="100%" display="flex" justifyContent="center">
              <Image src={handWriting} alt="Hand writing illustration" maxW={{ base: '90%', md: '800px' }} opacity={0.9} />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Layout>
  );
}


