/**
 * Google Apps Script for Valentine Ticket Registration System
 * 
 * This script handles:
 * 1. Checking if a user already exists (by email or phone) - GET request
 * 2. Appending new registrations to the sheet - POST request
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Add headers in row 1: Name | Email | Phone | Status | Timestamp | Approval Type | Referral Code
 * 3. Go to Extensions → Apps Script
 * 4. Delete any code and paste this entire script
 * 5. Click Deploy → New Deployment
 * 6. Select "Web app" as the type
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone"
 * 9. Click Deploy and authorize the app
 * 10. Copy the Web App URL to your .env file as GOOGLE_SHEET_WEBAPP_URL
 * 
 * IMPORTANT: After updating this script, you must create a NEW deployment
 * for changes to take effect. Go to Deploy → New Deployment.
 */

// Configuration - adjust these if your columns are different
const CONFIG = {
    EMAIL_COLUMN: 2,    // Column B
    PHONE_COLUMN: 3,    // Column C
    HEADER_ROW: 1,      // First row is headers
};

/**
 * Handle GET requests - used for checking if user exists
 */
function doGet(e) {
    try {
        const action = e.parameter.action || 'check';

        if (action === 'check') {
            const email = (e.parameter.email || '').toLowerCase().trim();
            const phone = (e.parameter.phone || '').trim();

            const result = checkUserExists(email, phone);

            return ContentService.createTextOutput(JSON.stringify(result))
                .setMimeType(ContentService.MimeType.JSON);
        }

        // Default response for health check
        return ContentService.createTextOutput(JSON.stringify({
            status: 'ok',
            message: 'Valentine Registration Sheet API is running!'
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            error: error.toString(),
            exists: false
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Handle POST requests - used for appending new registrations
 */
function doPost(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const data = JSON.parse(e.postData.contents);

        // Append the row with all data
        sheet.appendRow([
            data.name || '',
            data.email || '',
            data.phone || '',
            data.status || 'Pending',
            data.timestamp || new Date().toISOString(),
            data.approvalType || 'N/A',
            data.referralCode || 'N/A'
        ]);

        return ContentService
            .createTextOutput(JSON.stringify({ success: true }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Check if a user exists in the sheet by email or phone
 * @param {string} email - Email to check (lowercase)
 * @param {string} phone - Phone to check
 * @returns {Object} - { exists: boolean, matchType?: 'email' | 'phone' | 'both' }
 */
function checkUserExists(email, phone) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    let emailMatch = false;
    let phoneMatch = false;

    // Skip header row (index 0)
    for (let i = CONFIG.HEADER_ROW; i < data.length; i++) {
        const rowEmail = (data[i][CONFIG.EMAIL_COLUMN - 1] || '').toString().toLowerCase().trim();
        const rowPhone = (data[i][CONFIG.PHONE_COLUMN - 1] || '').toString().trim();

        if (email && rowEmail === email) {
            emailMatch = true;
        }

        if (phone && rowPhone === phone) {
            phoneMatch = true;
        }

        // Early exit if both found
        if (emailMatch && phoneMatch) {
            break;
        }
    }

    if (emailMatch && phoneMatch) {
        return { exists: true, matchType: 'both' };
    } else if (emailMatch) {
        return { exists: true, matchType: 'email' };
    } else if (phoneMatch) {
        return { exists: true, matchType: 'phone' };
    }

    return { exists: false };
}
