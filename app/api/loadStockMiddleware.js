import * as actionTypes from '../constants/actionTypes';
import {refreshStockInfo, refreshStockHistory} from '../actions';

export default function loadStockMiddleware(store){
    
    function checkStockInfo(state){
        state.stockList.forEach(name => {
           if(state.stockInfo.filter(stock => stock.name === name).length === 0){
               loadStockInfo(name);
           } 
        });
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
                break;
        }
        
        return res;
    };
}