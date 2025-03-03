import BookForm from '@/components/admin/book-form';
import { getBookById } from '@/lib/actions/book.actions';
import { requireAdmin } from '@/lib/auth-guard';
import { notFound } from 'next/navigation';

const AdminProductUpdatePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  await requireAdmin();

  const { id } = await props.params;

  const book = await getBookById(id);

  if (!book || !book.id) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>

      <BookForm
        type="Update"
        book={book}
        bookId={book?.id}
        genres={book.genres.map((g) => ({
          id: g.genre.id,
          name: g.genre.name,
        }))}
        authors={book.authors.map((a) => ({
          id: a.author.id,
          name: a.author.name,
          bio: a.author.bio,
        }))}
      />
    </div>
  );
};

export default AdminProductUpdatePage;
