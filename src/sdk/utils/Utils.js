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
 * @return {Buffer} - The generated hash as a buffer object.
 */
function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.createHash('sha256').update(data).digest();
}

/**
 * Converts a binary string to a base64 URL encoded string
 * @param {string} str - The binary string to encode
 * @returns {string} The base64 URL encoded string
 */
function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Function to generate a PKCE challenge from the codeVerifier
 * @param {string} codeVerifier - The verifier used to generate the PKCE challenge
 * @returns {string} A base64 URL encoded SHA-256 hash of the verifier
 */
export function pkceChallengeFromVerifier(codeVerifier) {
  const hashed = sha256(codeVerifier);
  return base64UrlEncode(hashed);
}

/**
 * parseJWT - a function to parse a JSON Web Token (JWT)
 * @param {string} token - the JWT to parse
 * @returns {Object|null} - the JSON object represented by the token or null if the parsing fails
 */
export function parseJWT(token) {
  if (typeof token !== 'string') {
    throw new Error('Token must be a string');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const base64Payload = parts[1];
  try {
    return JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
  } catch (error) {
    return null;
  }
}

/**
 * Returns an object with key-value pairs of cookies extracted from the request headers
 * @param {Object} request - The HTTP request object that contains headers with cookie information
 * @returns {Object} - An object containing key-value pairs of cookies
 */
function getCookie(request) {
  const cookies = {};
  const cookieString = request.headers && request.headers.cookie;
  if (cookieString) {
    cookieString.split(';').forEach((cookie) => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
  }
  return cookies;
}

/**
 * Returns the session ID if it exists in the cookie header of the HTTP request object, otherwise generates a new session ID and returns it.
 * @param {Object} request - The HTTP request object
 * @returns {string} - A session ID string
 */
export function getSessionId(request) {
  if (!request.headers?.cookie){
    const sessionId = crypto.randomBytes(16).toString('hex');
    return sessionId;
  }
  const cookies = getCookie(request);
  return cookies.kindeSessionId || crypto.randomBytes(16).toString('hex');
}
