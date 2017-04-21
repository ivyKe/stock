import React from 'react';

import StockList from './StockList';
import StockHistory from './StockHistory';

/*
 * Note: This is kept as a container-level component, 
 *  i.e. We should keep this as the container that does the data-fetching 
 *  and dispatching of actions if you decide to have any sub-components.
 */
export default class Home extends React.Component {

  render() {
    return (
        <div className="container-fluid">
            <div className="row">
                <StockList />
                <StockHistory />
            </div>
        </div>
    );
  }
  
};
