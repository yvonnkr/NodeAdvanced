//#region STEPS TO FETCH AN EXISTING COOKIE-SESSION
const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("./config/keys");

const session =
  "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWVkNzAxMWU4MWU4NGEwYzY4ZTBhNmEzIn19";
console.log("SESSION-COOKIE:", session);

const decodedCookie = Buffer.from(session, "base64").toString("utf8");
console.log("DECODED-COOKIE:", decodedCookie);

const keygrip = new Keygrip([keys.cookieKey]);
const sessionSignature = keygrip.sign("session=" + session);
console.log("SESSION-SIGNATURE:", sessionSignature);

const isVerified = keygrip.verify("session=" + session, sessionSignature);
console.log("IS-VERIFIED:", isVerified);
//#endregion
