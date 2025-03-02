'use client';

import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Author } from '@/types';
import { insertAuthorSchema, updateAuthorSchema } from '@/lib/validators';
import { authorDefaultValues } from '@/lib/constants';

import { createAuthor, updateAuthor } from '@/lib/actions/author.actions';
const AuthorForm = ({
  type,
  author,
  authorId,
}: {
  type: 'Create' | 'Update';
  author?: Author;
  authorId?: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  if (author == null && type === 'Update')
    throw new Error('author cannot be null');
  const form = useForm<z.infer<typeof insertAuthorSchema>>({
    resolver: zodResolver(
      type === 'Update' ? updateAuthorSchema : insertAuthorSchema
    ),
    defaultValues: type === 'Update' ? author : authorDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertAuthorSchema>> = async (
    values
  ) => {
    if (type === 'Create') {
      const resp = await createAuthor(values);
      if (!resp.success) {
        toast({
          variant: 'destructive',
          description: resp.message,
        });
      } else {
        toast({
          description: resp.message,
        });
        router.push('/admin/authors');
      }
    }

    if (type === 'Update') {
      if (!authorId) {
        router.push('/admin/authors');
        return;
      }

      const resp = await updateAuthor({ ...values, id: authorId });

      if (!resp.success) {
        toast({
          variant: 'destructive',
          description: resp.message,
        });
      } else {
        toast({
          description: resp.message,
        });
        router.push('/admin/authors');
      }
    }
  };
  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertAuthorSchema>,
                'name'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="bio"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertAuthorSchema>,
                'bio'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter author bio"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? 'Submitting' : `${type} author`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AuthorForm;
