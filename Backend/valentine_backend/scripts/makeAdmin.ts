import prisma from "../src/db";

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error("Please provide an email address: bun run scripts/makeAdmin.ts <email>");
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" },
        });
        console.log(`Successfully promoted ${user.name} (${user.email}) to ADMIN.`);
    } catch (error) {
        console.error("Error updating user:", error);
        // Log more specific error for debugging
        if (error instanceof Error) {
            console.error("Details:", error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
