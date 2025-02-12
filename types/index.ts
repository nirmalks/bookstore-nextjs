import { insertBookSchema } from '@/lib/validators';
import { z } from 'zod';

export type Book = z.infer<typeof insertBookSchema> & {
  id: string
}

export type SectionTitleProps = {
  text: string;
}