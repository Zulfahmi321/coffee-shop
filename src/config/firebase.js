const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
module.exports = admin;

// const admin = require("firebase-admin");
// admin.initializeApp();
// module.exports = admin;