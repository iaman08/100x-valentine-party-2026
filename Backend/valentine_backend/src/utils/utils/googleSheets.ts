import axios from "axios";

const GOOGLE_SHEET_WEBAPP_URL = process.env.GOOGLE_SHEET_WEBAPP_URL;

/**
 * Check if a user already exists in the Google Sheet
 * @param email - Email to check
 * @param phone - Phone number to check
 * @returns Object with exists boolean and type (email/phone/both)
 */
export const checkUserExistsInSheet = async (
    email: string,
    phone: string
): Promise<{ exists: boolean; matchType?: "email" | "phone" | "both" }> => {
    if (!GOOGLE_SHEET_WEBAPP_URL) {
        console.warn("GOOGLE_SHEET_WEBAPP_URL not configured, skipping duplicate check");
        return { exists: false };
    }

    try {
        // Call Google Sheet with action=check to verify if user exists
        const response = await axios.get(GOOGLE_SHEET_WEBAPP_URL, {
            params: {
                action: "check",
                email: email.toLowerCase(),
                phone: phone,
            },
        });

        // Response should contain { exists: boolean, matchType?: string }
        return {
            exists: response.data?.exists || false,
            matchType: response.data?.matchType,
        };
    } catch (error) {
        console.error("Error checking user in Google Sheet:", error);
        // On error, fall back to allowing registration (don't block user)
        return { exists: false };
    }
};

export const appendToGoogleSheet = async (
    name: string,
    email: string,
    phone: string,
    status: string = "Pending",
    approvalType?: string,
    referralCode?: string
): Promise<boolean> => {
    if (!GOOGLE_SHEET_WEBAPP_URL) {
        console.warn("GOOGLE_SHEET_WEBAPP_URL not configured, skipping sheet update");
        return false;
    }

    const timestamp = new Date().toISOString();

    try {
        await axios.post(GOOGLE_SHEET_WEBAPP_URL, {
            action: "append",
            name,
            email,
            phone,
            status,
            timestamp,
            approvalType: approvalType || "N/A",
            referralCode: referralCode || "N/A",
        });
        console.log("Data appended to Google Sheet successfully");
        return true;
    } catch (error) {
        console.error("Error appending to Google Sheet:", error);
        return false;
    }
};
