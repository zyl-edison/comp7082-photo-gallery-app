import express from 'express';

/**
 * BUILD
 *
 * Create routers(express router which also can be replace with other router
 * without touching another piece in the codebase) and map each router with a
 * controller action for business logic
 *
 * @param  {Object} routes      an object contains all routes configuration
 * @param  {Object} controllers an object contains all controller instances
 * @return {Array}              a list of routers
 */
export const build = (routes, controllers) => {
  const list = [];
  Object.keys(routes).forEach((r) => {
    const router = new express.Router();
    const ctrl = controllers[r];
    const routeList = routes[r];
    routeList.forEach((o) => {
      const {method, url, action} = o;
      router[method.toLowerCase()](
        `/${r}${url ? '/' + url : ''}`,
        ctrl[action]().bind(ctrl)
      );
    });
    list.push(router);
  });
  return list;
};
