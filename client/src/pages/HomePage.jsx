import { Box, Button, Container, Heading, Stack, Text, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import handWriting from '../assets/hand_writing.png';

export default function HomePage() {
  return (
    <Layout>
      <Box pt={{ base: 20, md: 28 }} pb={{ base: 8, md: 12 }}>
        <Container>
          <Stack spacing={8} align="center" textAlign="center">
            <Heading size="2xl" letterSpacing="-0.04em" lineHeight={1.05}>
              Your library, simply organized
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" maxW="2xl">
              A great space to manage your books.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button as={Link} to="/books" size="lg">
                Manage Your Library
              </Button>
            </Stack>
            <Box pt={{ base: 6, md: 8 }} w="100%" display="flex" justifyContent="center">
              <Image src={handWriting} alt="Hand writing illustration" maxW={{ base: '80%', md: '700px' }} opacity={0.9} />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Layout>
  );
}


