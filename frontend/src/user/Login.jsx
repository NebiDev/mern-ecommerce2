import {useState} from 'react'
import { Link } from 'react-router-dom'

function Login() {
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')



    const loginSubmitHandler = (e) => {
        e.preventDefault()
        // Handle login logic here
        console.log('Login submitted:', { loginEmail, loginPassword })
    }

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
