/*
  Warnings:

  - You are about to drop the column `imagePath` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "imagePath",
ADD COLUMN     "banner" TEXT,
ADD COLUMN     "images" VARCHAR(255)[];
