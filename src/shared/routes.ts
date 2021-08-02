/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const defaultOptions = {
  prefix: '',
  spacer: 7,
};

function getPathFromRegex(regexp: any) {
  return regexp.toString().replace('/^', '').replace('?(?=\\/|$)/i', '').replace(/\\\//g, '/');
}

function combineStacks(acc: any, stack: any) {
  if (stack.handle.stack) {
    const routerPath = getPathFromRegex(stack.regexp);
    return [...acc, ...stack.handle.stack.map((stack: any) => ({ routerPath, ...stack }))];
  }
  return [...acc, stack];
}

function getStacks(app: any) {
  // Express 3
  if (app.routes) {
    // convert to express 4
    return Object.keys(app.routes)
      .reduce((acc: any, method: any) => [...acc, ...app.routes[method]], [])
      .map((route: any) => ({ route: { stack: [route] } }));
  }

  // Express 4
  if (app._router && app._router.stack) {
    return app._router.stack.reduce(combineStacks, []);
  }

  // Express 4 Router
  if (app.stack) {
    return app.stack.reduce(combineStacks, []);
  }

  // Express 5
  if (app.router && app.router.stack) {
    return app.router.stack.reduce(combineStacks, []);
  }

  return [];
}

export const routesExtractor = (app: any, opts: any | null = null) => {
  const stacks = getStacks(app);
  const options = { ...defaultOptions, ...opts };
  const routes = [];

  if (stacks) {
    for (const stack of stacks) {
      if (stack.route) {
        const routeLogged: any = {};
        for (const route of stack.route.stack) {
          const method = route.method ? route.method.toUpperCase() : null;
          if (!routeLogged[method] && method) {
            const stackMethod = method;
            const stackPath = [options.prefix, stack.routerPath, stack.route.path, route.path].filter((s) => !!s).join('/');
            routes.push({ key: stackMethod + '|' + stackPath, method: stackMethod, path: stackPath });
            routeLogged[method] = true;
          }
        }
      }
    }
  }

  const result = [];
  const map = new Map();
  for (const item of routes) {
    if (!map.has(item.key)) {
      map.set(item.key, true);
      result.push({
        method: item.method,
        path: item.path
      });
    }
  }

  return result;
};