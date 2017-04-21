import React from 'react';
import {connect} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    const stockList = state.reducer.stockList.map(stockName => {
        const info = state.reducer.stockInfo.filter( info => info.name === stockName);
        return (info.length) ? info[0] : {name: stockName, price: 'loading...'};
    });
    return {...ownProps, stockList};
}

class StockList extends React.Component {

  render() {
    const { stockList } = this.props;
      
    return (
      <div className='col-md-5'>
        <form className="form-inline">
            <div className="form-group">
                <label>股票代號：
                <input type="text" className="form-control" placeholder="請輸入股票代號"/></label>
            </div>
            <button type="submit" className="btn btn-default">Add</button>
        </form>
            
        <table className="table table-striped">
            <thead>
                <tr>
                    <td>#</td>
                    <td>代號</td>
                    <td>股價</td>
                    <td>漲跌幅</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {
                    stockList.map((stock,index) =>{
                        const priceCName = stock.rise > 0 ? 'bg-danger':(stock.rise < 0 ?'bg-success':'' );
                        const riseCName = stock.rise > 0 ? 'text-danger':(stock.rise < 0 ?'text-success':'' );
                        let riseIName = stock.rise > 0 ? 'glyphicon-triangle-top':(stock.rise < 0 ?'glyphicon-triangle-bottom':'glyphicon-minus' );
                        
                        riseIName = "glyphicon "+riseIName;
                        return (
                        <tr key={stock.name}>
                            <td>{index+1}</td>
                            <td>{stock.name}</td>
                            <td className={priceCName}>{stock.price}</td>
                            <td className={riseCName}><span>{stock.rise}</span><span className={riseIName}></span></td>
                            <td><span className="glyphicon glyphicon-trash"></span></td>
                        </tr>
                    )})}
            </tbody>
        </table>
      </div>
    );
  }
  
};

export default connect(
    mapStateToProps
)(StockList);
