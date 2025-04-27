-- CreateTable
CREATE TABLE "UserInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avenue" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "province" TEXT NOT NULL DEFAULT 'kinshasa',
    "codePostal" TEXT,
    "pays" TEXT NOT NULL DEFAULT 'congo-kinshasa',
    "telephone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "personnelId" TEXT,
    "debutDate" TIMESTAMP(3) NOT NULL,
    "debutTime" TIMESTAMP(3) NOT NULL,
    "offDay" TEXT[],
    "isStayingAtHome" BOOLEAN NOT NULL,
    "isDayOff" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL DEFAULT 'mpesa',
    "paymentId" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "paymentAmount" INTEGER NOT NULL,
    "paymentStatus" TEXT,
    "paymentMethod" TEXT,
    "paymentRef" TEXT,
    "paymentDescription" TEXT,
    "paymentCurrency" TEXT DEFAULT 'USD',
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_userId_key" ON "UserInfo"("userId");

-- AddForeignKey
ALTER TABLE "UserInfo" ADD CONSTRAINT "UserInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_clientInfo_fkey" FOREIGN KEY ("clientId") REFERENCES "UserInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
