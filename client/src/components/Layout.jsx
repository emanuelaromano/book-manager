import { Box, Container, Flex, HStack, Link as ChakraLink, Text, Button } from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Layout({ children, mainProps = {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    navigate('/auth');
  }

  const isAuthPage = location.pathname.startsWith('/auth');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!cancelled) setIsAuthenticated(res.ok);
      } catch (_e) {
        if (!cancelled) setIsAuthenticated(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return (
    <Flex direction="column" minH="100dvh">
      <Box position="sticky" top={0} zIndex={10} backdropFilter="saturate(180%) blur(14px)" bg="rgba(255,255,255,0.7)" borderBottomWidth="1px">
        <Container py={4} maxW="6xl">
          <Flex align="center" justify="space-between">
            <HStack spacing={6}>
              <ChakraLink as={Link} to="/" fontWeight="semibold" letterSpacing="-0.02em">
                Book Manager
              </ChakraLink>
              {!isAuthPage && isAuthenticated && (
                <ChakraLink as={Link} to="/books" color="gray.600" _hover={{ color: 'gray.900' }}>
                  Books
                </ChakraLink>
              )}
            </HStack>
            <HStack>
              {!isAuthPage && isAuthenticated && (
                <Button size="sm" variant="ghost" onClick={logout}>Logout</Button>
              )}
              {(isAuthPage || isAuthenticated === false) && (
                <Button size="sm" as={Link} to="/auth" colorScheme="blue">Enter</Button>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box as="main" flex="1 1 auto" {...mainProps}>{children}</Box>

      <Box as="footer" borderTopWidth="1px" bg="white">
        <Container py={4}>
          <Flex align="center" justify="space-between">
            <Text color="gray.500">© {new Date().getFullYear()} Book Manager</Text>
            <HStack spacing={6} color="gray.500">
              <ChakraLink href="#">Privacy</ChakraLink>
              <ChakraLink href="#">Terms</ChakraLink>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
}


