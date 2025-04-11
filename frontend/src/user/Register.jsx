import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../UserStyles/Form.css'
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { register, removeErrors, removeSuccess } from '../features/user/userSlice'




function Register() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        
    })
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('./images/avatar.jpg')
    const {name, email, password } = user
    const {loading, error, success} = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // const registerDataChange = (e) => {
    //     if(e.target.name === 'avatar') {
    //         const reader = new FileReader()
    //         reader.onload = () => {
    //             if(reader.readyState === 2) {
    //                 setAvatarPreview(reader.result)
    //                 setAvatar(reader.result)
    //             }
    //         }
            
    //     } else {
    //         setUser({...user, [e.target.name]: e.target.value})
    //     }
    // }


    const registerDataChange = (e) => {
        const { name, value, files } = e.target;
      
        if (name === 'avatar') {
          const file = files[0];
          if (!file) return;
      
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.readyState === 2) {
              setAvatarPreview(reader.result);
              setAvatar(reader.result); // Base64 string (for testing, or sending directly to backend)
            }
          };
          reader.readAsDataURL(file);
        } else {
          setUser((prev) => ({ ...prev, [name]: value }));
        }
      };
      




    const registerSubmit = (e) => {
        e.preventDefault()
        if(!name || !email || !password  ) {
            toast.error('Please fill all fields')
            return
        }

        if(password.length < 6) {
            toast.error('Password should be at least 6 characters')
            return
        }

        const myFormData = new FormData()
        myFormData.set('name', name)
        myFormData.set('email', email)
        myFormData.set('password', password)
        myFormData.set('avatar', avatar)

        console.log(myFormData.entries())
        for (let entry of myFormData.entries()) {
            console.log(entry[0] + ', ' + entry[1]);
        }
        dispatch(register(myFormData))      
    }
   useEffect(() => {
         if(error) {
                toast.error(error)
                dispatch(removeErrors())
          }
            if(success) {
                toast.success('Registered successfully')
                dispatch(removeSuccess())
                navigate('/login')
            }
        
   }, [dispatch, error, success])




  return (
    <div className="form-container ">
        <div className="form-content">
            <form  className="form" onSubmit={registerSubmit} encType='multipart/form-data'>
                <h2 className="form-title">Welcome to our platform</h2>
                <h2>Sign up</h2>
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder='Username' 
                        name='name'
                        value={name}
                        onChange={registerDataChange}
                        />
                </div>
                <div className="input-group">
                    <input 
                        type="email" 
                        placeholder='Email' 
                        name='email'
                        value={email}
                        onChange={registerDataChange}
                        />
                </div>
                <div className="input-group">
                    <input 
                        type="password" 
                        placeholder='Password' 
                        name='password'
                        value={password}
                        onChange={registerDataChange}
                        />
                </div>
                <div className="input-group avatar-group">
                    <input 
                        type="file"  
                        name='avatar' 
                        className='file-input' 
                        accept='image/*'
                        onChange={registerDataChange}
                        />
                    <img src={avatarPreview} alt="Avatar Preview" className='avatar'/>
                </div>
                <button className="authBtn">Sign up</button>
                <p className="form-links">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
        
      
    </div>
  )
}

export default Register
