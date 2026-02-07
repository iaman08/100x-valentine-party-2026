-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."PendingUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCampusStudent" BOOLEAN NOT NULL DEFAULT false,
    "referralCode" TEXT,

    CONSTRAINT "PendingUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Refral" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Refral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "fromrefralcode" BOOLEAN NOT NULL DEFAULT false,
    "isCampusStudent" BOOLEAN NOT NULL DEFAULT false,
    "referralCode" TEXT,
    "referredBy" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."freeUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,

    CONSTRAINT "freeUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."userfromrefral" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refralcodeId" TEXT NOT NULL,

    CONSTRAINT "userfromrefral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_email_key" ON "public"."PendingUser"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_phoneNo_key" ON "public"."PendingUser"("phoneNo" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Refral_code_key" ON "public"."Refral"("code" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNo_key" ON "public"."User"("phoneNo" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "public"."User"("referralCode" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "freeUser_email_key" ON "public"."freeUser"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "freeUser_phoneNo_key" ON "public"."freeUser"("phoneNo" ASC);

-- AddForeignKey
ALTER TABLE "public"."Refral" ADD CONSTRAINT "Refral_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."userfromrefral" ADD CONSTRAINT "userfromrefral_refralcodeId_fkey" FOREIGN KEY ("refralcodeId") REFERENCES "public"."Refral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."userfromrefral" ADD CONSTRAINT "userfromrefral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

