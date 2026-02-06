import "dotenv/config";
import prisma from "./db";

async function testDatabase() {
    console.log("Testing database connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 50) + "...");

    try {
        // Test connection
        await prisma.$connect();
        console.log("✅ Connected to database!");

        // Check pending users
        const pendingUsers = await prisma.pendingUser.findMany();
        console.log("\n📋 Pending Users:", pendingUsers.length);
        pendingUsers.forEach(u => console.log(`  - ${u.name} (${u.email})`));

        // Check approved users
        const users = await prisma.user.findMany();
        console.log("\n👥 Approved Users:", users.length);
        users.forEach(u => console.log(`  - ${u.name} (${u.email})`));

        await prisma.$disconnect();
        console.log("\n✅ Test complete!");
    } catch (error) {
        console.error("❌ Database error:", error);
    }
}

testDatabase();
