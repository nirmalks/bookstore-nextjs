'use client';

import Rating from '@/components/shared/Rating';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getReviews } from '@/lib/actions/review.actions';
import { formatDateTime } from '@/lib/utils';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReviewForm from './review-form';
import { Review } from '@/types';
import { User } from 'lucide-react';

const ReviewList = ({
  userId,
  bookId,
  bookSlug,
}: {
  userId: string;
  bookId: string;
  bookSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const reload = async () => {
    const resp = await getReviews({ bookId });
    setReviews(resp.data);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm
          userId={userId}
          bookId={bookId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          Please
          <Link
            className="text-blue-700 px-2"
            href={`/sign-in?callbackUrl=/books/${bookSlug}`}
          >
            sign in
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviews.map((review: Review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  {review.user ? review.user.name : 'User'}
                </div>
                <div className="flex items-center">
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
