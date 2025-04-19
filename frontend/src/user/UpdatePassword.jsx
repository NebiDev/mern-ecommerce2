import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import '../UserStyles/Form.css'
import {useSelector, useDispatch} from 'react-redux'
import {removeErrors, removeSuccess, updatePassword} from '../features/user/userSlice'
import { toast } from 'react-toastify'
import PageTitle from '../components/PageTitle'

function UpdatePassword() {
 

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const {error, success, loading } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
  

const updatePasswordHandler = (e) => {
    e.preventDefault()
    const payload = {
        oldPassword,
        newPassword,
        confirmPassword
    }
    dispatch(updatePassword(payload))
   
}

useEffect(() => {
    if (error) {
        toast.error(error)
        dispatch(removeErrors())
    }
    if (success) {
        toast.success('Password updated successfully')
        dispatch(removeSuccess())
        navigate('/profile')
    }
}, [dispatch, error, success])




  return (
   <>
    <PageTitle title='Update Password' />
    
    <div className='update-container '>
        <div className="form-content">
                    <form className="form" onSubmit={updatePasswordHandler} > 
                <h2>Update Password </h2>

                <div className="input-group">
                    <input
                        name='oldPassword'
                        type="password"
                        placeholder='Old Password'
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        
                         />
                </div>
                <div className="input-group">
                    <input
                        name='newPassword'
                        type="password"
                        placeholder='New Password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}                                                  
                        />
                </div>
                <div className="input-group">
                    <input
                        name='confirmPassword'
                        type="password"
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}                                               
                        />
                </div>
                <button className="authBtn" type='submit' disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
            </div>          
    </div>
    </>
  )
}

export default UpdatePassword
