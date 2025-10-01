import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  useToast,
  Stack
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

async function fetchBooks() {
  const res = await fetch('/api/books', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default function BooksPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({ id: null, title: '', author: '', year: '', notes: '' });
  const toast = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: books = [], isLoading } = useQuery({ queryKey: ['books'], queryFn: fetchBooks });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Create failed');
      return res.json();
    },
    onMutate: async (newBook) => {
      await qc.cancelQueries({ queryKey: ['books'] });
      const prev = qc.getQueryData(['books']);
      const optimistic = { ...newBook, id: Math.random(), createdAt: new Date().toISOString() };
      qc.setQueryData(['books'], (old = []) => [optimistic, ...old]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['books'], ctx.prev);
      toast({ title: 'Create failed', status: 'error' });
    },
    onSuccess: () => {
      toast({ title: 'Book added', status: 'success' });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['books'] })
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Update failed');
      return res.json();
    },
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: ['books'] });
      const prev = qc.getQueryData(['books']);
      qc.setQueryData(['books'], (old = []) => old.map((b) => (b.id === patch.id ? { ...b, ...patch } : b)));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['books'], ctx.prev);
      toast({ title: 'Update failed', status: 'error' });
    },
    onSuccess: () => toast({ title: 'Book updated', status: 'success' }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['books'] })
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      return id;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['books'] });
      const prev = qc.getQueryData(['books']);
      qc.setQueryData(['books'], (old = []) => old.filter((b) => b.id !== id));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['books'], ctx.prev);
      toast({ title: 'Delete failed', status: 'error' });
    },
    onSuccess: () => toast({ title: 'Book deleted', status: 'success' }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['books'] })
  });

  function openCreate() {
    setForm({ id: null, title: '', author: '', year: '', notes: '' });
    onOpen();
  }
  function openEdit(book) {
    setForm({ id: book.id, title: book.title, author: book.author || '', year: book.year || '', notes: book.notes || '' });
    onOpen();
  }
  async function submit() {
    if (!form.title.trim()) {
      toast({ title: 'Title is required', status: 'warning' });
      return;
    }
    const payload = { title: form.title.trim(), author: form.author || null, year: form.year ? Number(form.year) : null, notes: form.notes || null };
    if (form.id) await updateMutation.mutateAsync({ id: form.id, ...payload });
    else await createMutation.mutateAsync(payload);
    onClose();
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    navigate('/auth');
  }

  return (
    <Layout>
      <Container maxW="5xl" py={10}>
        <Stack direction="row" justify="space-between" align="center" mb={6}>
          <Heading letterSpacing="-0.02em">My Books</Heading>
          <Stack direction="row">
            <Button onClick={openCreate} colorScheme="blue" rounded="full">Add Book</Button>
          </Stack>
        </Stack>
        <Box borderWidth="1px" rounded="xl" overflowX="auto" bg="white">
          <Table size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Year</Th>
                <Th>Notes</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {books.map((b) => (
                <Tr key={b.id}>
                  <Td>{b.title}</Td>
                  <Td>{b.author || '-'}</Td>
                  <Td>{b.year || '-'}</Td>
                  <Td>{b.notes || '-'}</Td>
                  <Td textAlign="right">
                    <IconButton aria-label="Edit" size="sm" mr={2} icon={<EditIcon />} onClick={() => openEdit(b)} />
                    <IconButton aria-label="Delete" size="sm" colorScheme="red" icon={<DeleteIcon />} onClick={() => deleteMutation.mutate(b.id)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{form.id ? 'Edit Book' : 'Add Book'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                </FormControl>
                <FormControl>
                  <FormLabel>Author</FormLabel>
                  <Input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
                </FormControl>
                <FormControl>
                  <FormLabel>Year</FormLabel>
                  <Input type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} />
                </FormControl>
                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose}>Cancel</Button>
              <Button colorScheme="blue" onClick={submit} isLoading={createMutation.isPending || updateMutation.isPending}>
                {form.id ? 'Save' : 'Create'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Layout>
  );
}


