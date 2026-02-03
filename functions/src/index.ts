import {setGlobalOptions} from "firebase-functions/v2";
import * as functions from "firebase-functions";
import {google} from "googleapis";
import {v4 as uuidv4} from "uuid";

// কনটেইনারের সংখ্যা সীমিত রাখা (Cost Control)
setGlobalOptions({maxInstances: 10});

// ফোল্ডার আইডি এবং ক্রেডেনশিয়াল (আপনার দেওয়া তথ্য অনুযায়ী)
const folderId = "1ebczIB27IeIcK8G8EZu-UvZHZf3tDIRr";
const CLIENT_ID = "74567183415-0p5rfagptklbj8e98tmno8nj8ushbgpp.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN = "1//04SsJjb1NrbP0CgYIARAAGAQSNwF-L9Ire2FVL3SSKq0PMdZr8CLkWzpyn0bMyN6bIMjRk3yyL7RNDhOY5g2JPF8RPw9se-Me81Y";

// OAuth2 ক্লায়েন্ট সেটআপ (যা আপনার কোটা এরর দূর করবে)
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oauth2Client });

// ৬ ডিজিটের পাসওয়ার্ড জেনারেটর
function generateSixDigitPassword(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export const uploadToDrive = functions.https.onCall(async (request) => {
  // ডাটা রিসিভ করা
  const imageData = request.data.imageStream;
  const serverGeneratedId = uuidv4().substring(0, 8); 
  const serverGeneratedPassword = generateSixDigitPassword();

  try {
    // ইমেজ ডেটাকে বাফারে রূপান্তর (ড্রাইভের জন্য জরুরি)
    const imageBuffer = Buffer.from(imageData, 'base64');

    const fileMetadata = {
      name: `BITA_Emp_${serverGeneratedId}_${Date.now()}.jpg`,
      parents: [folderId],
    };

    const media = {
      mimeType: "image/jpeg",
      // স্ট্রিম হিসেবে ডাটা পাঠানো
      body: require('stream').Readable.from(imageBuffer), 
    };

    // ড্রাইভ এ ফাইল তৈরি
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    // ফাইলটি পাবলিকলি দেখার অনুমতি দেওয়া
    await drive.permissions.create({
      fileId: file.data.id!,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return {
      success: true, 
      fileId: file.data.id, 
      link: file.data.webViewLink,
      employeeId: serverGeneratedId,
      tempPassword: serverGeneratedPassword
    };

  } catch (error: any) {
    console.error("Final Drive Upload Error:", error.message);
    return {
      success: false, 
      error: error.message || "Upload failed"
    };
  }
});