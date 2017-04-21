import * as actionTypes from '../constants/actionTypes';

/**
 ** 新增股票
 */
export function addStock(name){
    return {type:actionTypes.ADD_STOCK,name};
}

/**
 ** 刪除股票
 */
export function removeStock(name){
    return {type:actionTypes.REMOVE_STOCK,name};
}

/**
 ** 選擇股票
 */
export function selectStock(name){
    return {type:actionTypes.SELECT_STOCK,name};
}

/**
 ** 更新股票資訊
 */
export function refreshStockInfo(info){
    return {type:actionTypes.REFRESH_STOCK_INFO,info};
}

/**
 ** 更新股票歷史資料
 */
export function refreshStockHistory(history){
    return {type:actionTypes.REFRESH_STOCK_HISTORY,history};
}