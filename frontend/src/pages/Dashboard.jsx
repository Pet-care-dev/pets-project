import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);
  const [user, setUser] = useState(null);
  const [newPetName, setNewPetName] = useState('');
  const [newPetImg, setNewPetImg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await API.get('/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data); // Should contain at least { first_name }
      } catch (err) {
        console.error('Unauthorized or expired token');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleAddPet = () => {
    if (!newPetName || !newPetImg) {
      alert('Please enter pet name and image URL.');
      return;
    }

    const newPet = { name: newPetName, img: newPetImg };

    setUser(prev => ({
      ...prev,
      pets: [...(prev.pets || []), newPet],
    }));

    setNewPetName('');
    setNewPetImg('');
    setShowPetForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <p>Loading Dashboard...</p>;
  }

  return (
    <div className="container">
      <header className="header">
        <div className="title">Dashboard</div>
        <div className="menu-icon" onClick={() => setShowSidebar(!showSidebar)}>
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
      </header>

      {showSidebar && (
        <div className="sidebar">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="User"
            className="avatar"
          />
          <h3>Name: {user.first_name}</h3>

          {user.pets?.length > 0 ? (
            <>
              <h4>Pets:</h4>
              <div className="pets">
                {user.pets.map((pet, index) => (
                  <div className="pet" key={index}>
                    <img src={pet.img} alt={pet.name} />
                    <p>{pet.name}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No pets added yet.</p>
          )}

          {!showPetForm ? (
            <button className="sidebar-btn" onClick={() => setShowPetForm(true)}>
              Add Pet
            </button>
          ) : (
            <div className="add-pet-form">
              <input
                type="text"
                placeholder="Pet name"
                value={newPetName}
                onChange={e => setNewPetName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newPetImg}
                onChange={e => setNewPetImg(e.target.value)}
              />
              <button onClick={handleAddPet} className="sidebar-btn">Save Pet</button>
            </div>
          )}

          <button className="sidebar-btn">Manage profile</button>
          <button className="sidebar-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <div className="cards">
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/3047/3047486.png" alt="Find vets" />
          <p className="label">Find vets</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/1046/1046893.png" alt="Shop for pets" />
          <p className="label">Shop for pets</p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Adopt a pet" />
          <p className="label">Adopt a pet</p>
        </div>
      </div>

      <footer className="footer">Find everything your furry friend needs!</footer>
      <div className="page-number">3</div>
    </div>
  );
};

export default Dashboard;
