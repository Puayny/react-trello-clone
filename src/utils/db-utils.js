/**
 * Create unique task card ID
 * Assume max 1 task card created per user per millisecond
 * @param {string} userId
 * @returns task card ID
 */
export function createTaskCardId(userId) {
    return "USER" + userId + "TIME" + Date.now();
}

/**
 * Initialize task card and save it to DB
 * @param {Object} db 
 * @param {string} userId 
 * @returns ID of task card that was created
 */
export function createTaskCard(db, userId) {
    const taskCardId = createTaskCardId(userId);
    db[taskCardId] = { "header": "", "content": "" };
    return taskCardId
}

/**
 * Retrieve details of task card
 * @param {Object} db 
 * @param {string} taskCardId 
 * @returns task card details
 */
export function retrieveTaskCardDetails(db, taskCardId) {
    return db[taskCardId];
}

/**
 * Save changes made to task card
 * @param {Object} db 
 * @param {string} cardId 
 * @param {string} newText 
 * @param {enum} cardPortion 
 */
export function saveTaskCardChanges(db, cardId, newText, cardPortion) {
    db[cardId][cardPortion] = newText;
}