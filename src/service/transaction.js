const {
  getLogger,
} = require('../core/logging');
const ServiceError = require('../core/serviceError');
const transactionRepository = require('../repository/transaction');


const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

/**
 * Get all transactions.
 */
const getAll = async () => {
  debugLog('Fetching all transactions');
  const items = await transactionRepository.findAll();
  const count = await transactionRepository.findCount();
  return {
    items,
    count,
  };
};

/**
 * Get the transaction with the given `id`.
 *
 * @param {number} id - Id of the transaction to find.
 */
const getById = async (id) => {
  debugLog(`Fetching transaction with id ${id}`);
  const transaction = await transactionRepository.findById(id);

  if (!transaction) {
    throw ServiceError.notFound(`There is no transaction with id ${id}`, {
      id,
    });
  }

  return transaction;
};

/**
 * Create a new transaction, will create a new place if necessary.
 *
 * @param {object} transaction - The transaction to create.
 * @param {number} transaction.amount - Amount deposited/withdrawn.
 * @param {Date} transaction.date - Date of the transaction.
 * @param {number} transaction.placeId - Id of the place the transaction happened.
 * @param {number} transaction.userId - Id of the user who did the transaction.
 */
const create = async ({
  amount,
  date,
  placeId,
  userId,
}) => {
  debugLog('Creating new transaction', {
    amount,
    date,
    placeId,
    userId,
  });

  const id = await transactionRepository.create({
    amount,
    date,
    placeId,
    userId,
  });
  return getById(id);
};

/**
 * Update an existing transaction, will create a new place if necessary.
 *
 * @param {number} id - Id of the transaction to update.
 * @param {object} transaction - The transaction data to save.
 * @param {number} [transaction.amount] - Amount deposited/withdrawn.
 * @param {Date} [transaction.date] - Date of the transaction.
 * @param {number} [transaction.placeId] - Id of the place the transaction happened.
 * @param {number} [transaction.userId] - Id of the user who did the transaction.
 */
const updateById = async (id, {
  amount,
  date,
  placeId,
  userId,
}) => {
  debugLog(`Updating transaction with id ${id}`, {
    amount,
    date,
    placeId,
    userId,
  });

  await transactionRepository.updateById(id, {
    amount,
    date,
    placeId,
    userId,
  });
  return getById(id);
};

/**
 * Delete the transaction with the given `id`.
 *
 * @param {number} id - Id of the transaction to delete.
 */
const deleteById = async (id) => {
  debugLog(`Deleting transaction with id ${id}`);
  await transactionRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};