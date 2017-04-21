import * as actionTypes from '../constants/actionTypes';

const defaultValue = {
    stockList:[],
    stockInfo:[],
    stockHistory:[],
    selectedStock:''
};

export default (state = defaultValue,action) => {
    switch(action.type){
            
        case actionTypes.SELECT_STOCK:
            
            if(state.stockList.indexOf(action.name)!==-1){
                return {...state,
                        selectedStock: action.name
                };
            }else{
                return state;
            }
            
        case actionTypes.ADD_STOCK:
            
            if(state.stockList.indexOf(action.name)===-1){
                return {...state , 
                        stockList:[...state.stockList,action.name]
                       };
            }else{
                return state;
            }
            
        case actionTypes.REMOVE_STOCK:
            
            return {...state , 
                    stockList: state.stockList.filter(name => name !== action.name),
                    stockInfo: state.stockInfo.filter(info => info.name !== action.name),
                    stockHistory: state.stockHistory.filter(history => history.name !== action.name),
                    selectedStock: (state.selectedStock === action.name ? '' : state.selectedStock)
            };
               
        case actionTypes.REFRESH_STOCK_INFO:
            
            return {...state,
                    stockInfo:[
                        ...state.stockInfo.filter(info => info.name !== action.info.name),
                        action.info
                    ]};
            
        case actionTypes.REFRESH_STOCK_HISTORY:
            
            return{...state,
                   stockHistory:[
                   ...state.stockHistory.filter(history => history.name !== action.history.name),
                   action.history
                   ]};
            
        default:
            return state;
    }
}