import React from 'react'
import SalesChart from '../charts/SalesChart'

const SalesAnalytics = () => {
  return (
    <div className="col-xxl-8">
        <div className="panel chart-panel-1">
            <div className="panel-header">
                <h5>Product Sales Analytics</h5>
            </div>
            <div className="panel-body">
                <div id="saleAnalytics" className="chart-dark">
                    <SalesChart/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SalesAnalytics