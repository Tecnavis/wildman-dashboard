import React, { useState, useEffect } from 'react';
import { fetchAbout, updateAbout, createAbout } from '../../Helper/handle-api';

const About = () => {
  const [values, setValues] = useState({
    title: '',
    description: '',
    vision: '',
    mission: '',
    goal: '',
    visionimage: null,
    missionimage: null,
    goalimage: null,
  });

  const [aboutId, setAboutId] = useState(null); // To track if data exists for update

  // Fetch existing "About" data
  useEffect(() => {
    const loadData = async () => {
      try {
        const aboutData = await fetchAbout();
        if (aboutData.length > 0) {
          const existingData = aboutData[0]; // Assuming single entry
          setValues({
            title: existingData.title || '',
            description: existingData.description || '',
            vision: existingData.vision || '',
            mission: existingData.mission || '',
            goal: existingData.goal || '',
            visionimage: null,
            missionimage: null,
            goalimage: null,
          });
          setAboutId(existingData._id); // Set the ID for update
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: files ? files[0] : value, // Handle file inputs and text inputs
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const key in values) {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    }

    try {
      if (aboutId) {
        // Update existing entry
        await updateAbout(aboutId, formData);
        alert('About section updated successfully!');
      } else {
        // Create new entry
        await createAbout(formData);
        alert('About section created successfully!');
      }
    } catch (error) {
      console.error('Error saving about section:', error);
      alert('Failed to save. Please try again.');
    }
  };

  return (
    <div className="panel mb-30">
      <div className="panel-header">
        <h5>About the Company</h5>
      </div>
      <div className="panel-body">
        <div className="row g-3">
          <div className="col-sm-12">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              onChange={handleChange}
              value={values.title}
            />
          </div>
          <div className="col-sm-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="3"
              onChange={handleChange}
              value={values.description}
            ></textarea>
          </div>
          <div className="col-sm-6">
            <label className="form-label">Vision</label>
            <input
              type="text"
              className="form-control"
              name="vision"
              onChange={handleChange}
              value={values.vision}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Vision Image</label>
            <input
              type="file"
              className="form-control"
              name="visionimage"
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Mission</label>
            <input
              type="text"
              className="form-control"
              name="mission"
              onChange={handleChange}
              value={values.mission}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Mission Image</label>
            <input
              type="file"
              className="form-control"
              name="missionimage"
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Goal</label>
            <input
              type="text"
              className="form-control"
              name="goal"
              onChange={handleChange}
              value={values.goal}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Goal Image</label>
            <input
              type="file"
              className="form-control"
              name="goalimage"
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-12">
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>
              {aboutId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
