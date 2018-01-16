import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { convertNumberToText, dateToUTC9 } from '../../utils/utils'
import icon_01 from '../../style/image/icon_01.png'

class RecentTransactions extends Component {
  render() {
    const { tmainTx } = this.props.mainPage
    return (
      <li className="right">
        <p className="title">Recent Transactions<Link to='/transactions'><span>View all<em className="img"></em></span></Link></p>
        <div className="list-group">
          <ul className="list">
            {tmainTx.map(tx => {
              const { txHash, amount, fee } = tx
              return (
                <li key={txHash}>
                  <p className="icon"><img src={icon_01}/></p>
                  <p className="a">TX Hash<em>{txHash.substr(0, 42)}</em></p>
                  <p className="b">Amount<em>{`${convertNumberToText(amount, 'icx')} ICX`}</em></p>
                  <p className="c">Fee<em>{`${convertNumberToText(fee, 'icx')} ICX`}</em></p>
                </li>
              )
            })}
          </ul>
        </div>
      </li>
    );
  }
}

export default RecentTransactions;
