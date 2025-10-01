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
      <Box position="sticky" top={0} zIndex={10} bg="white" borderBottomWidth="1px">
        <Container py={3}>
          <Flex align="center" justify="space-between">
            <HStack spacing={4}>
              <ChakraLink
                as={Link}
                to="/"
                fontWeight="semibold"
                letterSpacing="-0.02em"
                fontSize={{ base: 'md', md: 'lg' }}
                color="gray.800"
                _hover={{ textDecoration: 'none', color: 'black' }}
              >
                Book Manager
              </ChakraLink>
            </HStack>
            <HStack>
              {!isAuthPage && isAuthenticated && (
                <>
                  <Button size="sm" as={Link} to="/books" variant="ghost">Books</Button>
                  <Button size="sm" variant="ghost" onClick={logout}>Logout</Button>
                </>
              )}
              {(isAuthPage || isAuthenticated === false) && (
                <Button size="sm" as={Link} to="/auth">Enter</Button>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box as="main" flex="1 1 auto" {...mainProps}>{children}</Box>

      <Box as="footer" borderTopWidth="1px" bg="white">
        <Container py={3}>
          <Flex align="center" justify="space-between">
            <Text color="gray.500" fontSize="sm">© {new Date().getFullYear()} Book Manager</Text>
            <HStack spacing={6} color="gray.500" fontSize="sm">
              <ChakraLink href="#">Privacy</ChakraLink>
              <ChakraLink href="#">Terms</ChakraLink>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
}


