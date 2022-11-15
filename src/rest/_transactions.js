const Joi = require('joi');
const Router = require('@koa/router');

const transactionService = require('../service/transaction');
const userService = require('../service/user');
const {
  hasPermission,
  permissions,
  addUserInfo,
} = require('../core/auth');

const validate = require('./_validation.js');

const getAllTransactions = async (ctx) => {
  ctx.body = await transactionService.getAll();
};
getAllTransactions.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().max(1000).optional(),
    offset: Joi.number().min(0).optional(),
  }).and('limit', 'offset'),
};

const createTransaction = async (ctx) => {
  let userId = 0;
  try {
    const user = await userService.getByAuth0Id(ctx.state.user.sub);
    userId = user.id;
  } catch (err) {
    await addUserInfo(ctx);
    userId = await userService.register({
      auth0id: ctx.state.user.sub,
      name: ctx.state.user.name,
    });
  }

  const newTransaction = await transactionService.create({
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
    userId,
  });
  ctx.body = newTransaction;
  ctx.status = 201;
};
createTransaction.validationScheme = {
  body: {
    amount: Joi.number().invalid(0),
    date: Joi.date().iso().less('now'),
    placeId: Joi.number().integer().positive(),
  },
};

const getTransactionById = async (ctx) => {
  ctx.body = await transactionService.getById(ctx.params.id);
};
getTransactionById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateTransaction = async (ctx) => {
  ctx.body = await transactionService.updateById(ctx.params.id, {
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
};
updateTransaction.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    amount: Joi.number().invalid(0),
    date: Joi.date().iso().less('now'),
    placeId: Joi.number().integer().positive(),
  },
};

const deleteTransaction = async (ctx) => {
  await transactionService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteTransaction.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/transactions',
  });

  router.get('/', hasPermission(permissions.read), validate(getAllTransactions.validationScheme), getAllTransactions);
  router.post('/', hasPermission(permissions.write), validate(createTransaction.validationScheme), createTransaction);
  router.get('/:id', hasPermission(permissions.read), validate(getTransactionById.validationScheme), getTransactionById);
  router.put('/:id', hasPermission(permissions.write), validate(updateTransaction.validationScheme), updateTransaction);
  router.delete('/:id', hasPermission(permissions.write), validate(deleteTransaction.validationScheme), deleteTransaction);

  app.use(router.routes()).use(router.allowedMethods());
};