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
import slugify from 'slugify';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import { Book } from '@/types';
import { insertBookSchema, updateBookSchema } from '@/lib/validators';
import { bookDefaultValues } from '@/lib/constants';
import { createBook, updateBook } from '@/lib/actions/book.actions';
import Select from 'react-select';
import { UploadButton } from '@/lib/uploadthing';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
const BookForm = ({
  type,
  book,
  bookId,
  genres,
  authors,
}: {
  type: 'Create' | 'Update';
  book?: Book;
  bookId?: string;
  genres: {
    id: string;
    name: string;
  }[];
  authors: {
    id: string;
    name: string;
  }[];
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof insertBookSchema>>({
    resolver: zodResolver(
      type === 'Update' ? updateBookSchema : insertBookSchema
    ),
    defaultValues: type === 'Update' ? book : bookDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertBookSchema>> = async (
    values
  ) => {
    console.log('on submit', values);
    if (type === 'Create') {
      const resp = await createBook(values);
      console.log(resp);
      if (!resp.success) {
        toast({
          variant: 'destructive',
          description: resp.message,
        });
      } else {
        toast({
          description: resp.message,
        });
        router.push('/admin/books');
      }
    }

    if (type === 'Update') {
      if (!bookId) {
        router.push('/admin/books');
        return;
      }

      const res = await updateBook({ ...values, id: bookId });

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push('/admin/books');
      }
    }
  };

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');
  const [date, setDate] = useState<Date>();
  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit((data) => {
            onSubmit(data);
          })();
        }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="title"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertBookSchema>,
                'title'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter book name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertBookSchema>,
                'slug'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Enter slug" {...field} />
                    <Button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                      onClick={() => {
                        form.setValue(
                          'slug',
                          slugify(form.getValues('title'), { lower: true })
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="genres"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Select
                    isMulti
                    options={genres.map((g) => ({
                      value: g.id,
                      label: g.name,
                    }))}
                    value={field.value?.map((g) => ({
                      value: g.genre.id,
                      label: g.genre.name,
                    }))}
                    onChange={(selected) =>
                      field.onChange(
                        selected.map((s) => ({
                          genre: { id: s.value, name: s.label },
                        }))
                      )
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="authors"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Authors</FormLabel>
                <FormControl>
                  <Select
                    isMulti
                    options={authors.map((author) => ({
                      value: author.id,
                      label: author.name,
                    }))}
                    value={field.value?.map((author) => ({
                      value: author.author.id,
                      label: author.author.name,
                    }))}
                    onChange={(selected) =>
                      field.onChange(
                        selected.map((s) => ({
                          author: { id: s.value, name: s.label },
                        }))
                      )
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertBookSchema>,
                'price'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertBookSchema>,
                'stock'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder="Enter stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="isbn"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertBookSchema>,
                'isbn'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input placeholder="Enter isbn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publishedDate"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertBookSchema>,
                'publishedDate'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[280px] justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        {...field}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="book image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="space-x-2 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt="banner image"
                  className="w-full object-cover object-center rounded-sm"
                  width={1920}
                  height={680}
                />
              )}

              {isFeatured && !banner && (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue('banner', res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      variant: 'destructive',
                      description: `ERROR! ${error.message}`,
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertBookSchema>,
                'description'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter book description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? 'Submitting' : `${type} Book`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookForm;
