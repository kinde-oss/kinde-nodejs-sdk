/**
 * Create a session store object.
 * @returns {Object} The session store object.
 */
const createSessionStore = () => {
  let store = {};

  /**
   * Get data from the session store based on sessionId.
   * @param {string} sessionId - The session ID.
   * @returns {any} The data associated with the sessionId.
   */
  const getData = (sessionId) => store[sessionId];
  
  /**
   * Set data in the session store for a specific sessionId.
   * @param {string} sessionId - The session ID.
   * @param {any} data - The data to be stored.
   */
  const setData = (sessionId, data) => {
    store[sessionId] = data;
  };

  /**
   * Get data from the session store based on sessionId and key.
   * @param {string} sessionId - The session ID.
   * @param {string} key - The key to retrieve specific data.
   * @returns {any} The data associated with the sessionId and key.
   */
  const getDataByKey = (sessionId, key) => store[sessionId] ? store[sessionId][key] : undefined;

  /**
   * Set data in the session store for a specific sessionId and key.
   * @param {string} sessionId - The session ID.
   * @param {string} key - The key to store the data.
   * @param {any} data - The data to be stored.
   */
  const setDataByKey = (sessionId, key, data) => {
    if (!store[sessionId]) {
      store[sessionId] = {};
    }
    store[sessionId][key] = data;
  };

  /**
   * Remove data from the session store for a specific sessionId.
   * @param {string} sessionId - The session ID.
   */
  const removeData = (sessionId) => {
    if (store[sessionId]){
      delete store[sessionId];
    }
  };

  return {
    getData,
    setData,
    getDataByKey,
    setDataByKey,
    removeData,
  };
};

export default createSessionStore();