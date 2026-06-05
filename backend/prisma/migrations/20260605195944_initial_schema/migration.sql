/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `college` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `degree` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heightCm` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incomeLpa` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openToPets` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openToRelocate` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wantKids` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "YesNoMaybe" AS ENUM ('YES', 'NO', 'MAYBE');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED');

-- CreateEnum
CREATE TYPE "StatusTag" AS ENUM ('NEW', 'VERIFIED', 'IN_REVIEW', 'MATCHES_READY', 'MATCH_SENT', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SUGGESTED', 'SENT', 'ACCEPTED', 'REJECTED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "assignedMatchmakerId" TEXT,
ADD COLUMN     "caste" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "college" TEXT NOT NULL,
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "degree" TEXT NOT NULL,
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "diet" TEXT,
ADD COLUMN     "drinking" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "familyPreference" TEXT,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "heightCm" INTEGER NOT NULL,
ADD COLUMN     "incomeLpa" INTEGER NOT NULL,
ADD COLUMN     "languagesKnown" TEXT[],
ADD COLUMN     "maritalStatus" "MaritalStatus" NOT NULL,
ADD COLUMN     "marriageTimeline" TEXT,
ADD COLUMN     "openToPets" "YesNoMaybe" NOT NULL,
ADD COLUMN     "openToRelocate" "YesNoMaybe" NOT NULL,
ADD COLUMN     "personalityType" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "photos" TEXT[],
ADD COLUMN     "profileVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "relationshipGoal" TEXT,
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "siblingsCount" INTEGER,
ADD COLUMN     "smoking" TEXT,
ADD COLUMN     "statusTag" "StatusTag" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "values" TEXT[],
ADD COLUMN     "wantKids" "YesNoMaybe" NOT NULL;

-- CreateTable
CREATE TABLE "Matchmaker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Matchmaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerPreference" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "preferredAgeMin" INTEGER,
    "preferredAgeMax" INTEGER,
    "preferredHeightMin" INTEGER,
    "preferredHeightMax" INTEGER,
    "preferredIncomeMin" INTEGER,
    "preferredCities" TEXT[],
    "preferredCountries" TEXT[],
    "preferredReligions" TEXT[],
    "preferredCastes" TEXT[],
    "preferredDiets" TEXT[],
    "dealBreakers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchSuggestion" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "suggestedCustomerId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "reasons" TEXT[],
    "aiExplanation" TEXT,
    "introEmail" TEXT,
    "status" "MatchStatus" NOT NULL DEFAULT 'SUGGESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "MatchSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchmakerNote" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "matchmakerId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchmakerNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Matchmaker_email_key" ON "Matchmaker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPreference_customerId_key" ON "CustomerPreference"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_assignedMatchmakerId_fkey" FOREIGN KEY ("assignedMatchmakerId") REFERENCES "Matchmaker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerPreference" ADD CONSTRAINT "CustomerPreference_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchSuggestion" ADD CONSTRAINT "MatchSuggestion_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchSuggestion" ADD CONSTRAINT "MatchSuggestion_suggestedCustomerId_fkey" FOREIGN KEY ("suggestedCustomerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchmakerNote" ADD CONSTRAINT "MatchmakerNote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchmakerNote" ADD CONSTRAINT "MatchmakerNote_matchmakerId_fkey" FOREIGN KEY ("matchmakerId") REFERENCES "Matchmaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
