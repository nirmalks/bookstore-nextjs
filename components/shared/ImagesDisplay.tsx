'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

const ImagesDisplay = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-6">
      <Image
        src={`${images[current]}`}
        alt="image"
        width={400}
        height={400}
        className="min-h-[300px] object-cover object-center"
      ></Image>
      <div className="flex">
        {images.map((image, index) => {
          return (
            <div
              key={image}
              onClick={() => setCurrent(index)}
              className={cn(
                'border mr-2 cursor-pointer hover:border-orange-600',
                current === index && 'border-orange-500'
              )}
            >
              <Image src={`${image}`} alt="image" width={100} height={100} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImagesDisplay;
