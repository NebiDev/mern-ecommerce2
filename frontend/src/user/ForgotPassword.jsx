import '../UserStyles/Form.css'
import { useState, useEffect } from 'react'
import PageTitle from '../components/PageTitle'
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, removeErrors, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';


function ForgotPassword() {
    const [email, setEmail] = useState('')
    const dispatch = useDispatch();
    const { error, success, message, loading } = useSelector((state) => state.user);




const forgotPasswordEmailHandler = (e) => {
    e.preventDefault()
    dispatch(forgotPassword( email ))
    setEmail('')
   
}

useEffect(() => {
    if (error) {
        toast.error(error)
        dispatch(removeErrors())
    }
    if (success) {
        toast.success(message || 'Email sent successfully')
        dispatch(removeSuccess())
    }

}, [dispatch, error, success, message])

    


  return (
    <>
    <PageTitle title='Forgot Password' />
    <div className='forgot-container'>
        <div className="form-content email-group">
        <form  className="form" onSubmit={forgotPasswordEmailHandler} >
            <h2>Forgot Password</h2>
            <div className="input-group">
                <input 
                    type="text"
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder='Enter your registered email'/>
            </div>
            <button className="authBtn" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}

            </button>
        </form>
        </div>
      
    </div>
    </>
  )
}

export default ForgotPassword
