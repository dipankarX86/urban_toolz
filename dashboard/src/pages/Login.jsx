import { useState, useEffect } from 'react'
import {FaSignInAlt} from 'react-icons/fa' //
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router'
import {toast} from 'react-toastify'
import {login, reset} from '../features/auth/authSlice'  // Dis not understand the export from authSlice though
import Spinner from '../components/Spinner'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const {email, password} = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  // use effect function definition
  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    if(isSuccess || user) {
      navigate('/dashboard')
    }

    dispatch(reset())

  }, [user, isError, isSuccess, message, navigate, dispatch])

  // on change function definition
  const onChange = (e) => {
    setFormData((previousState) => ({
      ...previousState, 
      [e.target.name]: e.target.value,
    }))  // we want this to be an object , so paranthesis here
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // console.log(formData);

    const userData = {
      email,
      password
    }

    dispatch(login(userData))
  }

  if(isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Please enter your credentials</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              name="email" 
              value={email} 
              placeholder="enter your email" 
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              name="password" 
              value={password} 
              placeholder="choose a password" 
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className='btn btn-block'>Submit</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login