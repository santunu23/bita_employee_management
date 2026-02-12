import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const cors = require('cors')({origin: true});// এই লাইনটি corns ভেলিডেশানের জন্য তৈরি করা হয়েছে। 

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
