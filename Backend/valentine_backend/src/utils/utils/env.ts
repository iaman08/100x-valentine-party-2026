
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
    "DATABASE_URL",
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_CHAT_ID",
    "GOOGLE_SHEET_WEBAPP_URL",
];

export const validateEnv = () => {
    const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
        console.error(
            "❌ Missing required environment variables:",
            missingVars.join(", ")
        );
        process.exit(1);
    }

    console.log("✅ Environment variables validated");
};
