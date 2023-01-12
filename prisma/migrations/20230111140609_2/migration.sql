/*
  Warnings:

  - You are about to alter the column `stock` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "stock" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "Usage" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usage" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
