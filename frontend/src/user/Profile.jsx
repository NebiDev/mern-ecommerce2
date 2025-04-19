import React from 'react';
import '../UserStyles/Profile.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageTitle from '../components/PageTitle';

function Profile() {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  if (loading) return <p>Loading...</p>;
  if (!user || !isAuthenticated) return <p>User not found or not authenticated.</p>;

  return (
    <div className="profile-container">
      <PageTitle title={`${user.name} Profile`} />

      <div className="profile-image">
        <h3 className="profile-heading">My Profile</h3>
        <img
          src={user?.avatar?.url || './images/profile.jpg'}
          alt="User Profile"
          className="profile-image"
        />
        <Link to="/profile/update">Edit Profile</Link>
      </div>

      <div className="profile-details">
        <div className="profile-detail">
          <h2>Username</h2>
          <p>{user.name}</p>
        </div>
        <div className="profile-detail">
          <h2>Email</h2>
          <p>{user.email}</p>
        </div>
        <div className="profile-detail">
          <h2>Joined On</h2>
          <p>{user?.createdAt ? String(user.createdAt).substring(0, 10) : 'N/A'}</p>
        </div>

        <div className="profile-buttons">
          <Link to="/orders/user" className="profile-button">My Orders</Link>
          <Link to="/password/update" className="profile-button">Change Password</Link>
          {/* <Link to="/logout" className="profile-button">Logout</Link> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
