import React from 'react'
import BalanceChart from '../charts/BalanceChart'

const BalanceOverview = () => {
  return (
    <div className="col-lg-12">
        <div className="panel chart-panel-1">
            <div className="panel-header">
                <h5>Product Overview</h5>
            </div>
            <div className="panel-body">
                <div id="balanceOverview" className="chart-dark">
                    <BalanceChart/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BalanceOverview