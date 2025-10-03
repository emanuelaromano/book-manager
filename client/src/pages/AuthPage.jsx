import { useState, useEffect } from 'react';
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Stack, Text, InputGroup, InputRightElement, IconButton, useToast } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Layout from '../components/Layout.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const toast = useToast();
  const navigate = useNavigate();

  // Validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Set mode based on URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlMode = urlParams.get('mode');
    if (urlMode === 'login' || urlMode === 'register') {
      setMode(urlMode);
    }
  }, [location.search]);

  function validateForm() {
    if (!email) {
      toast({ title: 'Email required', description: 'Please enter your email', status: 'error' });
      return false;
    }
    if (!isValidEmail(email)) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address', status: 'error' });
      return false;
    }
    if (!password) {
      toast({ title: 'Password required', description: 'Please enter your password', status: 'error' });
      return false;
    }
    if (mode === 'register' && password !== confirmPassword) {
      toast({ title: 'Passwords do not match', status: 'error' });
      return false;
    }
    return true;
  }

  async function submit() {
    if (!validateForm()) {
      return;
    }
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
      setTimeout(() => {
        navigate('/books');
      }, 100);
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
          <Heading textAlign="center">{mode === 'login' ? 'Welcome back' : 'Create account'}</Heading>
          <Box p={6} borderWidth="1px" rounded="xl" bg="white" shadow="sm">
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  autoComplete="email"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <Input 
                    id="password"
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    minLength={6} 
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              {mode === 'register' && (
                <FormControl>
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <InputGroup>
                    <Input 
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        icon={showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              )}
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


