import React from 'react'
import Footer from '../components/footer/Footer'
import AllStockListHeader from '../components/header/AllStockListHeader'
import AllStockListFilter from '../components/filter/AllStockListFilter'
import AllStockListTable from '../components/tables/AllStockListTable'

const StockList = () => {
  return (
    <div className="main-content">
        <div className="row g-4">
            <div className="col-12">
                <div className="panel">
                    <AllStockListHeader/>
                    <div className="panel-body">
                        <AllStockListFilter/>
                        <AllStockListTable/>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default StockList