/*
  Warnings:

  - A unique constraint covering the columns `[sessionCartId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionCartId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cart_userId_key";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "itemsPrice" DECIMAL(12,2) NOT NULL DEFAULT 0.0,
ADD COLUMN     "sessionCartId" TEXT NOT NULL,
ADD COLUMN     "shippingPrice" DECIMAL(12,2) NOT NULL DEFAULT 0.0,
ADD COLUMN     "taxPrice" DECIMAL(12,2) NOT NULL DEFAULT 0.0,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(12,2);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessionCartId_key" ON "Cart"("sessionCartId");
