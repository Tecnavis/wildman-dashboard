import React, { useState } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import Footer from '../components/footer/Footer'
import Suppliercreate from '../components/user/tab-panes/Sippliercreate';

const CreateForm = () => {
    const [activeTab, setActiveTab] = useState('edit');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="main-content">
        <div className="dashboard-breadcrumb dashboard-panel-header mb-30">
            <h2>Create Ware House & Suppliers </h2>
        </div>

        <div className="row">
            <div className="col-12">
                <div className="panel">
                    <div className="panel-header">
                        <Nav
                            variant="tabs"
                            activeKey={activeTab}
                            onSelect={handleTabChange}
                            className="btn-box d-flex flex-wrap gap-1"
                        >
                        <Nav.Item>
                        <Nav.Link
                            eventKey="edit"
                            className={`btn btn-sm btn-outline-primary ${
                            activeTab === 'edit' ? 'active' : ''
                            }`}
                        >
                           Create Form
                        </Nav.Link>
                        </Nav.Item>
                        </Nav>
                    </div>
                    <div className="panel-body">
                        <Tab.Content className="profile-edit-tab">
                            <Tab.Pane eventKey="edit" className={`tab-pane ${activeTab === 'edit' ? 'show active' : ''}`}>
                                <Suppliercreate/>
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default CreateForm