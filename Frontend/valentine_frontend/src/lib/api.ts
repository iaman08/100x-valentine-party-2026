/**
 * API Service for Valentine Ticket System
 * Handles all communication between frontend and backend
 */

// API Base URL - defaults to localhost:3000 for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ============== Type Definitions ==============

export interface VerifyReferralResponse {
    valid: boolean;
    message: string;
    remainingUses?: number;
}

export interface RegisterUserRequest {
    name: string;
    email: string;
    phone: string;
    referralCode?: string;
}

export interface RegisterUserResponse {
    message: string;
    approved?: boolean;
    referralCode?: string;
    error?: string;
}

export interface ApiError {
    error: string;
    message?: string;
}

// ============== API Functions ==============

/**
 * Verify if a referral code is valid and has remaining uses
 * @param code - The referral code to validate
 * @returns Response indicating if code is valid with remaining uses
 */
export async function verifyReferralCode(code: string): Promise<VerifyReferralResponse> {
    const response = await fetch(`${API_BASE_URL}/verify-referral`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for token storage
        body: JSON.stringify({ code: code.toUpperCase() }),
    });

    const data = await response.json();

    if (!response.ok) {
        // Return the error response from backend
        return {
            valid: false,
            message: data.message || data.error || "Failed to validate referral code",
        };
    }

    return data;
}

/**
 * Register a new user
 * Handles three flows:
 * 1. Campus student (auto-approve)
 * 2. User with valid referral code (auto-approve)
 * 3. Non-campus user without referral (pending approval)
 * 
 * @param userData - User registration data
 * @returns Response with approval status and optional referral code
 */
export async function registerUser(userData: RegisterUserRequest): Promise<RegisterUserResponse> {
    const response = await fetch(`${API_BASE_URL}/open-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        // Handle error responses
        return {
            message: data.error || data.message || "Registration failed",
            approved: false,
            error: data.error,
        };
    }

    return data;
}

/**
 * Helper function to generate a unique ticket ID
 * Format: VB + 6 random alphanumeric characters
 */
export function generateTicketId(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "VB";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Check the approval status of a user
 * @param email - User's email address
 */
export async function checkStatus(email: string): Promise<{ status: "approved" | "pending" | "rejected", user?: any }> {
    const response = await fetch(`${API_BASE_URL}/check-status`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error("Failed to check status");
    }

    return response.json();
}
