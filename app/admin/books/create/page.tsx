import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';
import BookForm from '@/components/admin/book-form';
import { getAllGenres } from '@/lib/actions/book.actions';
import { getAuthorsWithoutPagination } from '@/lib/actions/author.actions';
export const metadata: Metadata = {
  title: 'Create Book',
};

const CreateBookPage = async () => {
  await requireAdmin();
  const genres = await getAllGenres();

  const authors = await getAuthorsWithoutPagination();
  return (
    <>
      <h2 className="h2-bold">Create Book</h2>
      <div className="my-8">
        <BookForm type="Create" genres={genres} authors={authors} />
      </div>
    </>
  );
};

export default CreateBookPage;
