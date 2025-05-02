/*
  Warnings:

  - The values [WEEKLY,MONTHLY] on the enum `HabitFrequency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HabitFrequency_new" AS ENUM ('DAILY', 'CUSTOM');
ALTER TABLE "habits" ALTER COLUMN "frequency" DROP DEFAULT;
ALTER TABLE "habits" ALTER COLUMN "frequency" TYPE "HabitFrequency_new" USING ("frequency"::text::"HabitFrequency_new");
ALTER TYPE "HabitFrequency" RENAME TO "HabitFrequency_old";
ALTER TYPE "HabitFrequency_new" RENAME TO "HabitFrequency";
DROP TYPE "HabitFrequency_old";
ALTER TABLE "habits" ALTER COLUMN "frequency" SET DEFAULT 'DAILY';
COMMIT;

-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "customDates" TIMESTAMP(3)[];
