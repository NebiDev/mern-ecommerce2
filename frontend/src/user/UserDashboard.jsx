import { useState, useEffect } from 'react';
import '../userStyles/UserDashboard.css';
import { useNavigate, useLocation  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { removeSuccess, logout } from '../features/user/userSlice';

const UserDashboard = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  


  const toggleMenu = () => setMenuOpen(!menuOpen);

  function orders() {
    navigate('/orders/user');
  }
  function profile() {
    navigate('/profile');
  }
  function logoutUser() {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success('Logout successful');
        dispatch(removeSuccess());
        navigate('/login');
      })
      .catch((error) => {
        toast.error(error || 'Logout failed');
      });
  }
  function adminDashboard() {
    navigate('/admin/dashboard');
  }

  const actions = { orders, profile, logoutUser, adminDashboard };

  const options = [
    { name: 'My Orders', funcName: 'orders' },
    { name: 'My Profile', funcName: 'profile' },
    { name: 'Logout', funcName: 'logoutUser' },
  ];
  if (user?.role === 'admin') {
    options.unshift({ name: 'Admin Dashboard', funcName: 'adminDashboard' });
  }

  return (
    <>
      <div className={`overlay ${menuOpen ? 'show' : ''}`} onClick={toggleMenu}></div>
      <div className="dashboard-container">
        <div className="profile-header" onClick={toggleMenu}>
          <img
            src={user?.avatar?.url || './images/profile.jpg'}
            alt="profile"
            className="profile-avatar"
          />
          <span className="profile-name">{user?.name || 'User'}</span>
        </div>
        {menuOpen && (
          <div className="menu-options">
            {options.map((option) => (
              <button
                className="menu-option-btn"
                key={option.name}
                onClick={actions[option.funcName]}
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;
