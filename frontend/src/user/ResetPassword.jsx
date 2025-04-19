import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../UserStyles/Form.css';
import PageTitle from '../components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { resetPassword, removeErrors, removeSuccess } from '../features/user/userSlice';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.user);

  const resetPasswordHandler = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(resetPassword({ token, newPassword, confirmPassword }));
  };
//   console.log(token, newPassword, confirmPassword);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Password has been reset successfully");
      dispatch(removeSuccess());
      navigate('/login');
    }
  }, [dispatch, error, success, navigate]);

  return (
    <>
      <PageTitle title='Reset Password' />

      <div className='update-container'>
        <div className='form-content'>
          <form className='form' onSubmit={resetPasswordHandler}>
            <h2>Reset Password</h2>

            <div className='input-group'>
              <input
                name='newPassword'
                type='password'
                placeholder='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className='input-group'>
              <input
                name='confirmPassword'
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className='authBtn' type='submit' disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
