/*
  Warnings:

  - You are about to drop the column `address` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `placedDate` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `PurchaseOrder` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetAddress` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemsPrice` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPrice` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxPrice` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_addressId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "address",
ADD COLUMN     "fullName" VARCHAR(100) NOT NULL,
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ADD COLUMN     "streetAddress" VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP COLUMN "addressId",
DROP COLUMN "placedDate",
DROP COLUMN "totalCost",
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveredAt" TIMESTAMP(6),
ADD COLUMN     "isDelivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "itemsPrice" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(6),
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "paymentResult" JSON,
ADD COLUMN     "shippingAddress" JSON NOT NULL,
ADD COLUMN     "shippingPrice" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "taxPrice" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(12,2) NOT NULL;
