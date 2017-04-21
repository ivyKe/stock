import * as actionTypes from '../constants/actionTypes';
import {refreshStockInfo, refreshStockHistory} from '../actions';
import * as d3 from "d3";

export default function loadStockMiddleware(store){
    
    function checkStockInfo(state){
        state.stockList.forEach(name => {
           if(state.stockInfo.filter(stock => stock.name === name).length === 0){
               loadStockInfo(name);
           } 
        });
    }
    
    function loadStockHistory(state){
        const stockName = state.selectedStock; 
        
        if(stockName && state.stockHistory.filter(history => history.name === stockName).length ===0){
            d3.csv(`https://www.google.com/finance/historical?q=${stockName.replace(":","%A3")}&startdate=Jan+01%2C+2017&enddate=May+01%2C+2017&output=csv`,
                  (err,data) => {
                const parsedData = data.map((d, i) => {
                    return {
                        date: new Date(d3.timeParse("%d-%b-%y")(d.Date).getTime()),
                        open: +d.Open,
                        high: +d.High,
                        low: +d.Low,
                        close: +d.Close,
                        volume: +d.Volume
                    };
                });
                parsedData.reverse();
                store.dispatch(refreshStockHistory({
                    name:stockName, history:parsedData
                }));
            });
        }
    }
    
    function loadStockInfo(name){
        fetch("https://www.google.com/finance/info?&q="+name).then(res =>{
            res.text().then(content => {
                try{
                    const data = JSON.parse(content.substr(3))[0];
                    store.dispatch(refreshStockInfo({
                        name, price:+data.l, rise:+data.c
                    }));
                }catch(err){
                    
                }
            })})
    }
    
    return next => action =>{
        const res = next(action);
        
        switch(action.type){
            case actionTypes.INIT_LOAD_STOCK:
                checkStockInfo(store.getState().reducer);
                loadStockHistory(store.getState().reducer);
                break;
            case actionTypes.SELECT_STOCK:
                loadStockHistory(store.getState().reducer);
                break;
            case actionTypes.ADD_STOCK:
                checkStockInfo(store.getState().reducer);
                break;
        }
        
        return res;
    };
}