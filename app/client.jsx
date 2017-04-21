import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createRoutes from 'routes.jsx';
import configureStore from 'store/configureStore';
import {initLoadStock} from './actions';
import loadStockMiddleware from 'api/loadStockMiddleware';

// Grab the state from a global injected into
// server-generated HTML
const initialState = window.__INITIAL_STATE__;

const store = configureStore(initialState, browserHistory, [loadStockMiddleware]);
const history = syncHistoryWithStore(browserHistory, store);
const routes = createRoutes(store);

store.dispatch(initLoadStock());

// Router converts <Route> element hierarchy to a route config:
// Read more https://github.com/rackt/react-router/blob/latest/docs/Glossary.md#routeconfig
render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>, document.getElementById('app'));
