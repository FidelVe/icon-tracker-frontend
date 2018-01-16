import React, { Component } from 'react';
import { getMainInfo } from '../../redux/api/rest'
import { InfoSummary, InfoChart, RecentBlocks, RecentTransactions } from '../../components'

class MainPage extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    this.props.getMainInfo()
  }

  render() {
    return (
      <div className="content-wrap">
        <div className="screen0">
          <div className="wrap-holder">
            <ul className="content half">
              <InfoSummary {...this.props}/>
              <InfoChart {...this.props}/>
            </ul>
          </div>
        </div>
        <div className="screen1">
          <div className="wrap-holder">
            <ul className="content half">
              <RecentBlocks {...this.props}/>
              <RecentTransactions {...this.props}/>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default MainPage;
