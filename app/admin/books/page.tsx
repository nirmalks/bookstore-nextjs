import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteBook, getAllBooks } from '@/lib/actions/book.actions';
import { formatPrice, shortenId } from '@/lib/utils';
import Link from 'next/link';

const AdminBooksPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || '';

  const { books, totalPages } = await getAllBooks({
    query: query,
    page,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <h1 className="h2-bold">Books</h1>
          {query && (
            <div>
              Filtered by <i>&quot;{query}&quot;</i>{' '}
              <Link href="/admin/books">
                <Button variant="outline" size="sm">
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant="default">
          <Link href="/admin/books/create">Create book</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>GENRE</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{shortenId(book.id)}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell className="text-right">
                {formatPrice(Number(book.price))}
              </TableCell>
              <TableCell>
                {book.genres.map((genre) => genre.genre.name).join(',')}
              </TableCell>
              <TableCell>{book.stock}</TableCell>
              <TableCell>{Number(book.rating)}</TableCell>
              <TableCell className="flex gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/books/${book.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={book.id} action={deleteBook} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
    </div>
  );
};

export default AdminBooksPage;
