import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match, createMemoryHistory } from 'react-router'
import axios from 'axios';
import { Provider } from 'react-redux';
import createRoutes from 'routes.jsx';
import configureStore from 'store/configureStore';
import headconfig from 'components/Meta';
import { fetchComponentDataBeforeRender } from 'api/fetchComponentDataBeforeRender';

const clientConfig = {
  host: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || '3000'
};

// configure baseURL for axios requests (for serverside API calls)
axios.defaults.baseURL = `http://${clientConfig.host}:${clientConfig.port}`;

/*
 * Our html template file
 * @param {String} renderedContent
 * @param initial state of the store, so that the client can be hydrated with the same state as the server
 * @param head - optional arguments to be placed into the head
 */
function renderFullPage(renderedContent, initialState, head={
  title: 'stock',
  meta: '<meta name="viewport" content="width=device-width, initial-scale=1" />',
  link: '<link rel="stylesheet" href="/assets/styles/main.css"/>'
}) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    ${head.title}
    ${head.meta}
    ${head.link}
  </head>
  <body>
    <div id="app">${renderedContent}</div>

    <script type="text/javascript">window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
    <script type="text/javascript" charset="utf-8" src="/assets/app.js"></script>
  </body>
  </html>
  `;
}

/*
 * Export render function to be used in server/config/routes.js
 * We grab the state passed in from the server and the req object from Express/Koa
 * and pass it into the Router.run function.
 */
export default function render(req, res) {
    const history = createMemoryHistory();
    const store = configureStore({
      reducer: {
        stockList:['NYSE:CHT','NYSE:HTC'],
        stockInfo: [
 
          { name: 'NYSE:CHT', price: 25.7, rise: -3 }
 
        ],
        stockHistory: [
 
          { name: 'NYSE:CHT', history: [
 
            { date: "2-Aug-12",  open: 29.33,  high: 29.42,  low: 29.27,  close: 29.38,  volume: 149347, },
 
            { date: "1-Aug-12",  open: 29.65,  high: 29.65,  low: 29.37,  close: 29.45,  volume: 139646, },
 
            { date: "31-Jul-12",  open: 29.99,  high: 30.04,  low: 29.56,  close: 29.67,  volume: 226076, },
 
            { date: "30-Jul-12",  open: 29.47,  high: 29.49,  low: 29.33,  close: 29.42,  volume: 108998, },
 
            { date: "27-Jul-12",  open: 29.28,  high: 29.56,  low: 29.22,  close: 29.52,  volume: 130014, },
 
            { date: "26-Jul-12",  open: 29.53,  high: 29.54,  low: 29.34,  close: 29.38,  volume: 110202, },
 
            { date: "25-Jul-12",  open: 29.69,  high: 29.79,  low: 29.45,  close: 29.48,  volume: 112644, },
 
            { date: "24-Jul-12",  open: 29.41,  high: 29.68,  low: 29.34,  close: 29.68,  volume: 158676, },
 
          ]}
 
        ],
 
        selectedStock: 'NYSE:CHT',
 
      }
 
    }, history);

    const routes = createRoutes(store);

  /*
   * From the react-router docs:
   *
   * This function is to be used for server-side rendering. It matches a set of routes to
   * a location, without rendering, and calls a callback(error, redirectLocation, renderProps)
   * when it's done.
   *
   * The function will create a `history` for you, passing additional `options` to create it.
   * These options can include `basename` to control the base name for URLs, as well as the pair
   * of `parseQueryString` and `stringifyQuery` to control query string parsing and serializing.
   * You can also pass in an already instantiated `history` object, which can be constructured
   * however you like.
   *
   * The three arguments to the callback function you pass to `match` are:
   * - error: A javascript Error object if an error occured, `undefined` otherwise.
   * - redirectLocation: A `Location` object if the route is a redirect, `undefined` otherwise
   * - renderProps: The props you should pass to the routing context if the route matched, `undefined`
   *                otherwise.
   * If all three parameters are `undefined`, this means that there was no route found matching the
   * given location.
   */
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const InitialView = (
        <Provider store={store}>
            <RouterContext {...renderProps} />
        </Provider>
      );

      // This method waits for all render component promises to resolve before returning to browser
      fetchComponentDataBeforeRender(store.dispatch, renderProps.components, renderProps.params)
      .then(() => {
        const componentHTML = renderToString(InitialView);
        const initialState = store.getState();
        res.status(200).end(renderFullPage(componentHTML, initialState, {
          title: headconfig.title,
          meta: headconfig.meta,
          link: headconfig.link
        }));
      })
      .catch(() => {
        res.end(renderFullPage('', {}));
      });
    } else {
      res.status(404).send('Not Found');
    }
  });
}