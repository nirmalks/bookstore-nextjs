import AuthorForm from '@/components/admin/author-form';
import { requireAdmin } from '@/lib/auth-guard';

const AdminAuthorsCreatePage = async () => {
  await requireAdmin();
  return (
    <>
      <h2 className="h2-bold">Create Author</h2>
      <div className="my-8">
        <AuthorForm type="Create" />
      </div>
    </>
  );
};

export default AdminAuthorsCreatePage;
