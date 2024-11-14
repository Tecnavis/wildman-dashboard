import React from 'react'
import Footer from '../components/footer/Footer'
import AddNewCategory from '../components/category/AddNewCategory'
import AllCategory from '../components/category/AllCategory'
import Subcategory from '../components/tables/subcategory'
import AllColorTable from '../components/tables/AllColorTable'
import AllSizeTable from '../components/tables/AllSizeTable'
import AllTagTable from '../components/tables/AllTagTable'

const CategoryMainContent = () => {
  return (
    <div className="main-content" style={{backgroundColor:""}}>
        <div className="dashboard-breadcrumb dashboard-panel-header mb-30">
            <h2>Categories</h2>
        </div>
        <div className="row g-4">
            {/* <AddNewCategory/> */}
            <AllCategory/>
            <Subcategory/>
            <AllColorTable/>
            <AllSizeTable/>
            <AllTagTable/>
        </div>

        <Footer/>
    </div>
  )
}

export default CategoryMainContent