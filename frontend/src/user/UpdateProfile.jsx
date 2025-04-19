import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import '../UserStyles/Form.css'
import { useSelector, useDispatch } from 'react-redux'
import {removeErrors, removeSuccess} from '../features/user/userSlice'
import {updateProfile} from '../features/user/userSlice'
import {toast} from 'react-toastify'
import PageTitle from '../components/PageTitle'

function UpdateProfile() {
    const [name , setName] = useState('')
    const [email , setEmail] = useState('')
    const [avatar , setAvatar] = useState('')
    const [avatarPreview , setAvatarPreview] = useState('./images/profile.jpg')

    const {user, error, success, message, loading} = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()





    const profileImageChange = (e) => {
        const reader = new FileReader()
        reader.onload = () => {
            if(reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }
        reader.onerror =(error) => {
            toast.error('Error loading image')
        }
        reader.readAsDataURL(e.target.files[0])
    }

    const updateHandler = async (e) => {
        e.preventDefault();
        const myForm= new FormData()
        myForm.set('name', name)
        myForm.set('email', email)
        myForm.set('avatar', avatar)
        dispatch(updateProfile(myForm))
    }

    useEffect(() => {
        if (user) {
          setName(user.name || '');
          setEmail(user.email || '');
          setAvatarPreview(user.avatar?.url || './images/profile.jpg');
        }
      }, [user]);
      

    useEffect(() => {
        if(error) {
            toast.error(error)
            dispatch(removeErrors())
        }
    }, [error, dispatch])

    useEffect(() => {
        if(success) {
            toast.success(message)
            dispatch(removeSuccess())
            navigate('/profile')
        }
    }, [success, message, dispatch, navigate])



    const loadingState = loading ? 'Updating...' : 'Update Profile';

  return (
    <>
    <PageTitle title='Update Profile' />
    <div className="update-container">
        <div className="form-content">
            <form className="form" onSubmit={updateHandler}  encType='multipart/form-data'> 
                <h2>Update Profile</h2>
                <div className="input-group avatar-group">
                    <input type="file" accept='image/*' onChange={profileImageChange}/>
                    <img 
                        src={avatarPreview}                       
                        alt="user profile" 
                        className="avatar"
                        name ="avatar" 
                        />
                </div>
                <div className="input-group">
                    <input
                    name='name'
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="input-group">
                    <input
                        name='email'
                        type="email" 
                       value={email} 
                       onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button className="authBtn" disabled={loading}>
                    {loadingState}
                </button>
            </form>

        </div>
    </div>
    
      
    </>
  )
}

export default UpdateProfile
