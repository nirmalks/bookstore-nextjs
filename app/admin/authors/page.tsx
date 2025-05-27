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
import { deleteAuthor, getAllAuthors } from '@/lib/actions/author.actions';
import { shortenId } from '@/lib/utils';
import Link from 'next/link';

const AdminAuthorsPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const query = Number(searchParams.query) || '';

  const authors = await getAllAuthors({
    page: page,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <h1 className="h2-bold">Authors</h1>
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
          <Link href="/admin/authors/create">Create author</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.data.map((author) => (
            <TableRow key={author.id}>
              <TableCell>{shortenId(author.id)}</TableCell>
              <TableCell>{author.name}</TableCell>

              <TableCell className="flex gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/authors/${author.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={author.id} action={deleteAuthor} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {authors.totalPages > 1 && (
        <Pagination page={page} totalPages={authors.totalPages} />
      )}
    </div>
  );
};

export default AdminAuthorsPage;
