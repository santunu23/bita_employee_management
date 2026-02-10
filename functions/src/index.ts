// // functions/src/index.ts
// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";

// admin.initializeApp();

// export const generateCredentials = functions.https.onCall({
//     cors: true, // এটি অন-কল ফাংশনের জন্য বাড়তি নিরাপত্তা দেয়
//     region: "us-central1" // আপনার ক্লাউড রানের রিজিয়নের সাথে মিলিয়ে দিন
// }, async (request) => {
    
//     // ৮ ডিজিটের ইউনিক আইডি তৈরি
//     const employeeId = Math.random().toString(36).substring(2, 10).toUpperCase();
//     // ৬ ডিজিটের পাসওয়ার্ড তৈরি
//     const tempPassword = Math.random().toString(36).substring(2, 8);
    
//     // ডাটা রিটার্ন করার সময় 'data' প্রপার্টির ভেতরে রাখা ভালো
//     return {
//         employeeId: employeeId,
//         tempPassword: tempPassword
//     };
// });


import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const cors = require('cors')({origin: true});

admin.initializeApp();

export const generateCredentials = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        const employeeId = Math.random().toString(36).substring(2, 10).toUpperCase();
        const tempPassword = Math.random().toString(36).substring(2, 8);
        
        res.status(200).send({
            employeeId: employeeId,
            tempPassword: tempPassword
        });
    });
});