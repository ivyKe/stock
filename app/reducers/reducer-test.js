import reducer from './reducer';
import * as actions from '../actions';
import * as actionTypes from '../constants/actionTypes';
import { expect } from 'chai';

const originState = {
    stockList: ['stock1', 'stock2'],
    stockInfo: [
        { name: 'stock1', value: 10, change: 3 },
        { name: 'stock2', value: 15, change: -3 },
    ],
    stockHistory: [
        { name: 'stock1', history: [] },
        { name: 'stock2', history: [] },
    ],
    selectedStock: 'stock1',
};

describe('Reducers Test', () => {
  it('selectStock', () => {
    expect(reducer({selectedStock: '', stockList:['stock:name']}, actions.selectStock('stock:name'))).to.deep.equal({
        selectedStock: 'stock:name',
        stockList: ['stock:name']
    });
  });

  it('addStock', () => {
    // 增加不存在的 stock → 加入清單
    expect(reducer(originState, actions.addStock('stock:name'))).to.deep.equal({
        stockList: ['stock1', 'stock2', 'stock:name'],
        stockInfo: [
            { name: 'stock1', value: 10, change: 3 },
            { name: 'stock2', value: 15, change: -3 },
        ],
        stockHistory: [
            { name: 'stock1', history: [] },
            { name: 'stock2', history: [] },
        ],
        selectedStock: 'stock1',
    });

    // 增加存在的 stock → 不改變
    expect(reducer(originState, actions.addStock('stock1'))).to.deep.equal({
        stockList: ['stock1', 'stock2'],
        stockInfo: [
            { name: 'stock1', value: 10, change: 3 },
            { name: 'stock2', value: 15, change: -3 },
        ],
        stockHistory: [
            { name: 'stock1', history: [] },
            { name: 'stock2', history: [] },
        ],
        selectedStock: 'stock1',
    });
  });

  it('removeStock', () => {
    // 移除不存在的 stock ，不改變
    expect(reducer(originState, actions.removeStock('stock:name'))).to.deep.equal({
        stockList: ['stock1', 'stock2'],
        stockInfo: [
            { name: 'stock1', value: 10, change: 3 },
            { name: 'stock2', value: 15, change: -3 },
        ],
        stockHistory: [
            { name: 'stock1', history: [] },
            { name: 'stock2', history: [] },
        ],
        selectedStock: 'stock1',
    });

    // 移除存在 stock ，清除相關資料
    expect(reducer(originState, actions.removeStock('stock2'))).to.deep.equal({
        stockList: ['stock1'],
        stockInfo: [
            { name: 'stock1', value: 10, change: 3 },
        ],
        stockHistory: [
            { name: 'stock1', history: [] },
        ],
        selectedStock: 'stock1',
    });

    // 移除存在且被選中的 stock ，清除相關資料 包含選取資料
    expect(reducer(originState, actions.removeStock('stock1'))).to.deep.equal({
        stockList: ['stock2'],
        stockInfo: [
            { name: 'stock2', value: 15, change: -3 },
        ],
        stockHistory: [
            { name: 'stock2', history: [] },
        ],
        selectedStock: '',
    });
  });

  it('refreshStockInfo', () => {
    const info1 = {
        name: 'stock:name', value: 10, change: 3.5,
    }
    const info2 = {
        name: 'stock1', value: 10, change: 3.5,
    }

    // 不存在的資訊 → 新增
    expect(reducer(originState, actions.refreshStockInfo(info1))).to.deep.equal({
        stockList: ['stock1', 'stock2'],
        stockInfo: [
            { name: 'stock1', value: 10, change: 3 },
            { name: 'stock2', value: 15, change: -3 },
            { name: 'stock:name', value: 10, change: 3.5 },
        ],
        stockHistory: [
            { name: 'stock1', history: [] },
            { name: 'stock2', history: [] },
        ],
        selectedStock: 'stock1',
    });

    // 存在的資訊 → 刪除後新增
    expect(reducer(originState, actions.refreshStockInfo(info2))).to.deep.equal({
        stockList: ['stock1', 'stock2'],
        stockInfo: [
            { name: 'stock2', value: 15, change: -3 },
            { name: 'stock1', value: 10, change: 3.5 },
        ],
        stockHistory: [
            { name: 'stock1', history: [] },
            { name: 'stock2', history: [] },
        ],
        selectedStock: 'stock1',
    });
  });

  it('refreshStockHistory', () => {
    const history1 = {
        name: 'stock:name', history: []
    }
    const history2 = {
        name: 'stock1', history: []
    }

    // 不存在的歷史記錄 → 新增
    expect(reducer(originState, actions.refreshStockHistory(history1))).to.deep.equal({
        stockList: ['stock1', 'stock2'],
        stockInfo: [
            { name: 'stock1', value: 10, change: 3 },
            { name: 'stock2', value: 15, change: -3 },
        ],
        stockHistory: [
            { name: 'stock1', history: [] },
            { name: 'stock2', history: [] },
            { name: 'stock:name', history: [] },
        ],
        selectedStock: 'stock1',
    });

    // 存在的歷史記錄 → 刪除舊的後再新增
    expect(reducer(originState, actions.refreshStockHistory(history2))).to.deep.equal({
        stockList: ['stock1', 'stock2'],
        stockInfo: [
            { name: 'stock1', value: 10, change: 3 },
            { name: 'stock2', value: 15, change: -3 },
        ],
        stockHistory: [
            { name: 'stock2', history: [] },
            { name: 'stock1', history: [] },
        ],
        selectedStock: 'stock1',
    });
  });

});