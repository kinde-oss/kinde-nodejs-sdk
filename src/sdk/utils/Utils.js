import crypto from 'crypto';

// Random a string function
export function randomString() {
  return crypto.randomBytes(28).toString('hex');
}

// Calculate the SHA256 hash of the input text.
// Returns a promise that resolves to an ArrayBuffer
function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

// Convert the ArrayBuffer to string using Uint8 array to conver to what btoa accepts.
// btoa accepts chars only within ascii 0-255 and base64 encodes them.
// Then convert the base64 encoded to base64url encoded
//   (replace + with -, replace / with _, trim trailing =)
function base64UrlEncode(str) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
}

// Return the base64-urlencoded sha256 hash for the PKCE challenge
export async function pkceChallengeFromVerifier(v) {
  const hashed = await sha256(v);
  return base64UrlEncode(hashed);
}

// Parse JSON from id token
export const parseJWT = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

/**
 * createStore- creates a new store object to store and retrieve data
 *
 * @returns {Object} - an object with the following methods:
 *    - getItem(key) - retrieves the value associated with the key from the store
 *    - setItem(key, value) - sets the value for the given key in the store
 *    - removeItem(key) - removes the key-value pair from the store
 */
export function createStore() {
  let items = {};

  const getItem = (key) => items[key];

  const setItem = (key, value) => {
    items[key] = value;
  };

  const removeItem = (key) => {
    delete items[key];
  };

  return {
    getItem,
    removeItem,
    setItem
  };
};

