import { useMemo, useState } from 'react';
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
  Stack,
  Spinner,
  Center,
  Switch,
  Image,
  Text
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteIcon, EditIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

async function fetchBooks() {
  const res = await fetch('/api/books', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default function BooksPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({ id: null, title: '', author: '', year: '', rating: '', notes: '', synopsis: '', isRead: false, imageUrl: '' });
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [filter, setFilter] = useState('');
  const [showOnlyRead, setShowOnlyRead] = useState(false);
  const toast = useToast();
  const qc = useQueryClient();

  const { data: books = [], isLoading } = useQuery({ queryKey: ['books'], queryFn: fetchBooks });

  function toggleSort(key) {
    setSort((prev) => {
      if (prev.key === key) {
        if (prev.dir === 'asc') {
          return { key, dir: 'desc' };
        } else if (prev.dir === 'desc') {
          return { key: null, dir: 'asc' };
        }
      }
      return { key, dir: 'asc' };
    });
  }

  const sortedBooks = useMemo(() => {
    const copy = [...books];
    if (!sort.key) return copy;
    const { key, dir } = sort;
    copy.sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av == null && bv == null) return 0;
      if (av == null) return dir === 'asc' ? 1 : -1;
      if (bv == null) return dir === 'asc' ? -1 : 1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return dir === 'asc' ? av - bv : bv - av;
      }
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      if (as < bs) return dir === 'asc' ? -1 : 1;
      if (as > bs) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [books, sort]);

  const displayedBooks = useMemo(() => {
    let filtered = sortedBooks;
    
    // Apply text filter
    const query = filter.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((b) => {
        const title = (b.title || '').toLowerCase();
        const author = (b.author || '').toLowerCase();
        const notes = (b.notes || '').toLowerCase();
        const year = b.year != null ? String(b.year) : '';
        const rating = b.rating != null ? String(b.rating) : '';
        return (
          title.includes(query) ||
          author.includes(query) ||
          notes.includes(query) ||
          year.includes(query) ||
          rating.includes(query)
        );
      });
    }
    
    // Apply read status filter
    if (showOnlyRead) {
      filtered = filtered.filter((b) => b.isRead === true);
    }
    
    return filtered;
  }, [sortedBooks, filter, showOnlyRead]);

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
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['books'], ctx.prev);
      toast({ title: err?.message || 'Create failed', status: 'error' });
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
    setForm({ id: null, title: '', author: '', year: '', rating: 3, notes: '', synopsis: '', isRead: false, imageUrl: '' });
    onOpen();
  }
  function openEdit(book) {
    setForm({ id: book.id, title: book.title, author: book.author || '', year: book.year || '', rating: book.rating || 3, notes: book.notes || '', synopsis: book.synopsis || '', isRead: book.isRead || false, imageUrl: book.imageUrl || '' });
    onOpen();
  }

  function StarRating({ value, onChange }) {
    return (
      <Stack direction="row" spacing={1} align="center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            p={1}
            minW="auto"
            h="auto"
            onClick={() => onChange(star)}
            color={star <= value ? "black" : "gray.300"}
            fontSize="lg"
            _hover={{ color: star <= value ? "black" : "gray.400" }}
          >
            ★
          </Button>
        ))}
      </Stack>
    );
  }
  async function submit() {
    if (!form.title.trim()) {
      toast({ title: 'Title is required', status: 'warning' });
      return;
    }
    const currentYear = new Date().getFullYear();
    if (form.year) {
      const numericYear = Number(form.year);
      if (Number.isNaN(numericYear)) {
        toast({ title: 'Year must be a number', status: 'warning' });
        return;
      }
      if (numericYear > currentYear) {
        toast({ title: 'Year cannot be in the future', status: 'warning' });
        return;
      }
    }
    const payload = { title: form.title.trim(), author: form.author || null, year: form.year ? Number(form.year) : null, rating: form.rating ? Number(form.rating) : null, notes: form.notes || null, synopsis: form.synopsis || null, isRead: form.isRead, imageUrl: form.imageUrl || null };
    if (form.id) await updateMutation.mutateAsync({ id: form.id, ...payload });
    else await createMutation.mutateAsync(payload);
    onClose();
  }

  return (
    <Layout>
      <Container py={8}>
          <Stack direction="row" justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
            <Heading size="md" letterSpacing="-0.02em" color="gray.800">My Books</Heading>
            <Stack direction="row" align="center" flexWrap="wrap" gap={2}>
              <Button onClick={openCreate}>Add Book</Button>
            </Stack>
          </Stack>
        <Box borderWidth="1px" rounded="md" overflowX="auto" bg="white" boxShadow="page">
          {isLoading ? (
            <Center py={10}>
              <Spinner />
            </Center>
          ) : (
          <>
          {books.length > 0 && <Box p={3} borderBottom="1px" borderColor="gray.100" bg="white" position="sticky" top={0} left={0} right={0} zIndex={1}>
            <Stack direction="row" spacing={3} align="center">
              <Input
                placeholder="Filter books..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                size="sm"
                flex="1"
                bg="white"
              />
              <Stack direction="row" align="center" spacing={2}>
                <Switch 
                  isChecked={showOnlyRead} 
                  onChange={(e) => setShowOnlyRead(e.target.checked)}
                  colorScheme="blue"
                />
                <Box fontSize="sm" color="gray.600" whiteSpace="nowrap">Only read</Box>
              </Stack>
            </Stack>
          </Box>}
          <Table size="sm" variant="notion">
            <Thead>
              <Tr>
                <Th>Cover</Th>
                <Th aria-sort={sort.key === 'title' ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <Button variant="ghost" size="xs" onClick={() => toggleSort('title')} rightIcon={sort.key === 'title' ? (sort.dir === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />) : undefined}>
                    Title
                  </Button>
                </Th>
                <Th aria-sort={sort.key === 'author' ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <Button variant="ghost" size="xs" onClick={() => toggleSort('author')} rightIcon={sort.key === 'author' ? (sort.dir === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />) : undefined}>
                    Author
                  </Button>
                </Th>
                <Th aria-sort={sort.key === 'year' ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <Button variant="ghost" size="xs" onClick={() => toggleSort('year')} rightIcon={sort.key === 'year' ? (sort.dir === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />) : undefined}>
                    Year
                  </Button>
                </Th>
                <Th aria-sort={sort.key === 'rating' ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <Button variant="ghost" size="xs" onClick={() => toggleSort('rating')} rightIcon={sort.key === 'rating' ? (sort.dir === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />) : undefined}>
                    Rating
                  </Button>
                </Th>
                <Th aria-sort={sort.key === 'notes' ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <Button variant="ghost" size="xs" onClick={() => toggleSort('notes')} rightIcon={sort.key === 'notes' ? (sort.dir === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />) : undefined}>
                    Notes
                  </Button>
                </Th>
                <Th aria-sort={sort.key === 'isRead' ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <Button variant="ghost" size="xs" onClick={() => toggleSort('isRead')} rightIcon={sort.key === 'isRead' ? (sort.dir === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />) : undefined}>
                    Status
                  </Button>
                </Th>
                <Th aria-sort={sort.key === 'createdAt' ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <Button variant="ghost" size="xs" onClick={() => toggleSort('createdAt')} rightIcon={sort.key === 'createdAt' ? (sort.dir === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />) : undefined}>
                    Added
                  </Button>
                </Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayedBooks.length === 0 ? (
                <Tr>
                  <Td colSpan={9} textAlign="center" py={6} color="gray.500">
                    No books added so far
                  </Td>
                </Tr>
              ) : (
                displayedBooks.map((b) => (
                  <Tr key={b.id}>
                    <Td>
                      <Image 
                        src={b.imageUrl || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA2MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMSA2MEgxOFY1NEgyMVY2MFpNMjQgNTRINDBWNjBIMjRWNTRaTTQyIDYwSDQwVjU0SDQyVjYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIzMCIgeT0iNzIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Cb29rPC90ZXh0Pgo8L3N2Zz4="} 
                        alt={`${b.title} cover`} 
                        height="60px" 
                        width="auto"
                        objectFit="contain" 
                        fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA2MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMSA2MEgxOFY1NEgyMVY2MFpNMjQgNTRINDBWNjBIMjRWNTRaTTQyIDYwSDQwVjU0SDQyVjYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIzMCIgeT0iNzIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Cb29rPC90ZXh0Pgo8L3N2Zz4="
                      />
                    </Td>
                    <Td>{b.title}</Td>
                    <Td>{b.author || '-'}</Td>
                    <Td>{b.year || '-'}</Td>
                    <Td>{b.rating != null ? '★'.repeat(b.rating) + '☆'.repeat(5 - b.rating) : '-'}</Td>
                    <Td>{b.notes || '-'}</Td>
                    <Td>
                      <Box 
                        px={2} 
                        py={1} 
                        borderRadius="md" 
                        fontSize="xs" 
                        fontWeight="medium"
                        bg={b.isRead ? "green.100" : "gray.100"}
                        color={b.isRead ? "green.800" : "gray.600"}
                        textAlign="center"
                      >
                        {b.isRead ? "Read" : "Unread"}
                      </Box>
                    </Td>
                    <Td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-'}</Td>
                    <Td textAlign="right" width="120px">
                      <Stack direction="row" spacing={1} justify="flex-end">
                        <IconButton aria-label="Edit" size="sm" variant="ghost" icon={<EditIcon />} onClick={() => openEdit(b)} />
                        <IconButton aria-label="Delete" size="sm" variant="ghost" colorScheme="red" icon={<DeleteIcon />} onClick={() => deleteMutation.mutate(b.id)} />
                      </Stack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
          </>
          )}
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent maxH="80vh" overflow="hidden">
            <ModalHeader>{form.id ? 'Edit Book' : 'Add Book'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflowY="auto" flex="1">
              <Stack spacing={3}>
                <FormControl isRequired>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="author">Author</FormLabel>
                  <Input id="author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
                </FormControl>
                <Stack direction="row" spacing={4}>
                  <FormControl flex={1}>
                    <FormLabel htmlFor="year">Year</FormLabel>
                    <Input id="year" type="number" max={new Date().getFullYear()} value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} />
                  </FormControl>
                  <FormControl flex={1}>
                    <FormLabel>Rating</FormLabel>
                    <StarRating 
                      value={Number(form.rating) || 1} 
                      onChange={(rating) => setForm((f) => ({ ...f, rating }))} 
                    />
                  </FormControl>
                </Stack>
                <FormControl>
                  <FormLabel htmlFor="notes">Notes</FormLabel>
                  <Textarea id="notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="synopsis">Synopsis</FormLabel>
                  <Textarea id="synopsis" value={form.synopsis} onChange={(e) => setForm((f) => ({ ...f, synopsis: e.target.value }))} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="imageUrl">Book Cover Image URL</FormLabel>
                  <Input id="imageUrl" type="url" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://example.com/book-cover.jpg" />
                </FormControl>
                <FormControl>
                  <Stack direction="row" align="flex-start" justify="space-between">
                    <Box>
                      {form.imageUrl && (
                        <Image 
                          src={form.imageUrl} 
                          alt="Book cover preview" 
                          height="100px" 
                          width="auto"
                          objectFit="contain" 
                          fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDEwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSAxMDBIMzBWOTBIMzVWMTAwWk00MCA5MEg2NVYxMDBINDBWOTBaTTcwIDEwMEg2NVY5MEg3MFYxMDBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjUwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qm9vazwvdGV4dD4KPC9zdmc+"
                        />
                      )}
                    </Box>
                    <Stack direction="row" align="top" spacing={3}>
                      <Switch 
                        id="isRead"
                        isChecked={form.isRead} 
                        onChange={(e) => setForm((f) => ({ ...f, isRead: e.target.checked }))}
                        colorScheme="blue"
                      />
                      <FormLabel htmlFor="isRead" mb={0} fontSize="sm">Mark as read</FormLabel>
                    </Stack>
                  </Stack>
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


