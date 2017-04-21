import React from 'react';
import {connect} from 'react-redux';
import StockChart from '../components/StockChart';

const mapStateToProps = (state,ownProps) =>{
    const stockHistory = state.reducer.stockHistory.filter(history => history.name === state.reducer.selectedStock);
    const history = stockHistory.length ? stockHistory[0].history.map(h => {
        return {...h, date: new Date(h.date)};
    }):[];
    
    return {...ownProps,stockName:state.reducer.selectedStock,history};
}

class StockHistory extends React.Component {

  render(){
    const {stockName,history} = this.props;
      
    return (
        <div className='col-md-7 col-xs-12'>
            <h1>{stockName}</h1>
            {history.length ? (
                <StockChart data={history} />
            ) : '' }
        </div>
    );
  }
  
};

export default connect(
    mapStateToProps)(StockHistory);