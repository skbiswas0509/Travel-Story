import React, { useState } from 'react'
import PasswordInput from '../components/Input/PasswordInput'
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) =>{
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please use a valid email");
      return;
    }

    if(!password){
      setError('Please enter the password')
      return;
    }

    setError("");

    //login api call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      })

      //handle successfull login response
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if(error.response &&
        error.response.data && 
        error.response.data.message
      ){
        setError(error.response.data.message);
      }else{
        setError("An unexpected error occured.PLease try again alater.")
      }
    }
  } 
  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>
        
        <div className="login-ui-box right-10 -top-40">

        </div>
        <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2-">
          
        </div>
        <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
          <div className='w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
            <div>
              <h4 className='text-5xl text-white font-semibold leading-[58px]'>
                Capture Your <br /> Journeys
              </h4>
              <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
                Record your travel experiences and memories in your personal travel journeys.
              </p>
            </div>
          </div>

          <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
            <form onSubmit={handleLogin}>
              <h4 className="text-2xl font-semibold mb-7">Login</h4>

              <input type="text" placeholder="Email" className='input-box'
              value={email} onChange={({target})=>{setEmail(target.value)}}/>

              <PasswordInput value={password} 
              onChange={({target})=>{setPassword(target.value)}}/>

              {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

              <button type='submit' className='btn-primary'>
                LOGIN
              </button>
              <p className='text xs text-slate-500 text-center my-4'>Or</p>

              <button type='submit' className='btn-primary btn-light' onSubmit={() => {
                navigate("/signup")
              }}>
                CREATE ACCOUNT
              </button>
            </form>
          </div>
        </div>
    </div>
  )
}

export default Login