import { useState } from 'react';
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Stack, Text, useToast } from '@chakra-ui/react';
import Layout from '../components/Layout.jsx';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Request failed');
      }
      toast({ title: mode === 'login' ? 'Logged in' : 'Registered', status: 'success' });
      navigate('/books');
    } catch (e) {
      toast({ title: 'Error', description: e.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Container maxW="sm" py={16}>
        <Stack spacing={6}>
          <Heading textAlign="center">Welcome back</Heading>
          <Box p={6} borderWidth="1px" rounded="xl" bg="white" shadow="sm">
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <Button isLoading={loading} colorScheme="blue" onClick={submit} rounded="full">
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </Button>
              <Text textAlign="center" color="gray.600">
                {mode === 'login' ? 'No account?' : 'Have an account?'}{' '}
                <Button variant="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                  {mode === 'login' ? 'Register' : 'Login'}
                </Button>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
}


