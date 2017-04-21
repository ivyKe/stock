import * as actions from './index';
import * as actionTypes from '../constants/actionTypes';
import { expect } from 'chai';

describe('Actions Test', () => {
  it('initLoadStock', () => {
    expect(actions.initLoadStock()).to.deep.equal({
      type: actionTypes.INIT_LOAD_STOCK
    });
  });

  it('addStock', () => {
    expect(actions.addStock('stock:name')).to.deep.equal({
      type: actionTypes.ADD_STOCK, name: 'stock:name',
    });
  });

  it('selectStock', () => {
    expect(actions.selectStock('stock:name')).to.deep.equal({
      type: actionTypes.SELECT_STOCK, name: 'stock:name',
    });
  });

  it('removeStock', () => {
    expect(actions.removeStock('stock:name')).to.deep.equal({
      type: actionTypes.REMOVE_STOCK, name: 'stock:name',
    });
  });

  it('refreshStockInfo', () => {
    const info = {
        name: 'stock:name', value: 10, change: 3.5,
    }
    expect(actions.refreshStockInfo(info)).to.deep.equal({
      type: actionTypes.REFRESH_STOCK_INFO, info
    });
  });

  it('refreshStockHistory', () => {
    const history = {
        name: 'stock:name', history: []
    }
    expect(actions.refreshStockHistory(history)).to.deep.equal({
      type: actionTypes.REFRESH_STOCK_HISTORY, history,
    });
  });
});