import React from 'react'
import SelectFilter from './SelectFilter'
import { useNavigate } from 'react-router-dom'


const CompanyFilter = () => {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate ("/createform")
    }
  return (
    <div className="table-filter-option">
        <div className="row g-3">
            <div className="col-xl-10 col-9 col-xs-12">
                <div className="row g-3">
                    <div className="col">
                        <form className="row g-2">
                            <div className="col">
                                <button className="btn btn-sm btn-primary w-100" onClick={handleClick}>NEW SUPPLIER</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-xl-2 col-3 col-xs-12 d-flex justify-content-end">
                <SelectFilter/>
            </div>
        </div>
    </div>
  )
}

export default CompanyFilter
