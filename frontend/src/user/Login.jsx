import {useState, useEffect, use} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { login, removeErrors, removeSuccess } from '../features/user/userSlice'
import '../UserStyles/Form.css'


function Login() {
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const {loading, error, success, isAuthenticated} = useSelector((state) => state.user)


    const dispatch = useDispatch()
    const navigate = useNavigate()



    const loginSubmitHandler = (e) => {
        e.preventDefault()
        dispatch(login({email: loginEmail, password: loginPassword}))   
    }

    useEffect(() => {
        if(error) {
            toast.error(error)
            dispatch(removeErrors())
        }
        if(success) {
            toast.success('Login successful')
            dispatch(removeSuccess())
        }
        if(isAuthenticated) {
            navigate('/')
        }
    }, [dispatch, error, success, isAuthenticated, navigate])





  return (
    <div className='form-container '>
        <div className="form-content">
            <form className="form" onSubmit={loginSubmitHandler}>
                <h1 className='form-title'>Login</h1>
                <div className="input-group">
                    <input 
                        type="email" 
                        placeholder='Email'
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)} 
                        />
                </div>
                <div className="input-group">
                    <input 
                        type="password" 
                        placeholder='Password' 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        />
                </div>
                
                    <button type="submit" className='authBtn'>Login</button>             
                    <p className='form-links'>Don't have an account? 
                        <Link to="/register">Register</Link>
                    </p>              
                    <p className='form-links'>
                        Forgot your password? <Link to="/password/forgot">Reset</Link>
                    </p>
            </form>
        </div>
      
    </div>
  )
}

export default Login
