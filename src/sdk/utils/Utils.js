import crypto from 'crypto';

/**
 * Generates a random string using the crypto module in Node.js
 * @returns {string} a random string of 28 hexadecimal characters
 */
export function randomString() {
  return crypto.randomBytes(28).toString('hex');
}

/**
 * Generates SHA-256 hash of the input string.
 * @param {string} plain - The input string to be hashed.
 * @return {Promise} A Promise that returns the generated hash.
 */
function sha256(plain) {
  const hash = crypto.createHash('sha256');
  hash.update(plain);
  return hash.digest('hex');
}

/**
 * Converts a binary string to a base64 URL encoded string
 * 
 * @param {string} str - The binary string to encode
 * 
 * @returns {string} The base64 URL encoded string
 */
function base64UrlEncode(str) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}


/**
 * Function to generate a PKCE challenge from the codeVerifier
 *  
 * @param {string} codeVerifier - The verifier used to generate the PKCE challenge
 * @returns {string} A base64 URL encoded SHA-256 hash of the verifier
 */
export async function pkceChallengeFromVerifier(codeVerifier) {
  const hashed = await sha256(codeVerifier);
  return base64UrlEncode(hashed);
}
/**
 * parseJWT - a function to parse a JSON Web Token (JWT)
 *
 * @param {string} token - the JWT to parse
 * @returns {Object|null} - the JSON object represented by the token or null if the parsing fails
 */
export function parseJWT(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}
