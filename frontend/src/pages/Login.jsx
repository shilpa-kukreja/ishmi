import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { useGoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, loginnavigate,setLoginnavigate } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();



const handleLoginSuccess = () => {
  
  const fromCart = location.state?.from === 'cart';
  const intendedPath = location.state?.intendedPath;
  
  if (fromCart && intendedPath) {
    
    navigate(intendedPath, { replace: true, state: {} });
  } else {
   
    navigate(loginnavigate, { replace: true });
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentState === 'Sign up' && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const url = currentState === 'Login' ? '/api/auth/login' : '/api/auth/register';
    const body = currentState === 'Login'
      ? { email, password, rememberMe }
      : { email, mobile, password };

    try {
      const response = await fetch(`https://ishmiherbal.com${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        alert(currentState === 'Login' ? 'Login successful' : 'Registration successful');
        handleLoginSuccess(); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const user = await userInfo.json();

        const response = await fetch('https://ishmiherbal.com/api/auth/gogglelogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });

        const data = await response.json();
        if (response.ok) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
          alert('Google login successful');
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error('Google Login Error', err);
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error);
    },
  });

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('https://ishmiherbal.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (token) {
      navigate(loginnavigate);
    }
  }, [token, navigate]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-white p-6'>
      <div className='flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg'>
        <div className='hidden md:flex md:w-1/2 bg-gray-200'>
          <img
            className='w-full h-full object-cover'
            src={currentState === 'Login' ? assets.Login1 : assets.SignUp1}
            alt='Illustration'
          />
        </div>

        <div className='w-full md:w-1/2 p-8 flex flex-col justify-center'>
          <img src={assets.S} alt='Logo' className='w-14 mx-auto' />
          <h2 className='text-xl font-bold text-center mt-5'>Your Wellness Journey Continues Here</h2>
          <p className='text-center text-gray-500'>
            {currentState === 'Login'
              ? 'Login to explore holistic skincare & mindful indulgence.'
              : 'Signup to explore holistic skincare & mindful indulgence.'}
          </p>

          <div className='flex items-center justify-center mt-6'>
            <button
              onClick={() => googleLogin()}
              className='flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
            >
              <img
                className='w-6'
                src='https://img.icons8.com/?size=100&id=17949&format=png&color=000000'
                alt='Google'
              />
              <span className='font-medium'>Sign in with Google</span>
            </button>
          </div>

          <div className='flex items-center my-5'>
            <hr className='w-full border-gray-300' />
            <span className='px-3 text-gray-500'>OR</span>
            <hr className='w-full border-gray-300' />
          </div>

          <form onSubmit={handleSubmit} className='space-y-4 relative'>
            <input
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-700 placeholder-gray-500'
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {currentState === 'Sign up' && (
              <input
                className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-700 placeholder-gray-500'
                type='tel'
                placeholder='Mobile Number'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            )}

            <div className='relative'>
              <input
                className='w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-gray-700 placeholder-gray-500'
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className='absolute top-3 right-3 cursor-pointer text-gray-600'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {currentState === 'Sign up' && (
              <div className='relative'>
                <input
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-gray-700 placeholder-gray-500'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute top-3 right-3 cursor-pointer text-gray-600'
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            )}

            {currentState === 'Login' && (
              <div className='flex justify-between items-center mt-2'>
                <label className='flex items-center text-gray-600'>
                  <input
                    type='checkbox'
                    className='mr-2'
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember Me
                </label>
                <button type='button' onClick={handleForgotPassword} className='text-blue-500 text-sm'>
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type='submit'
              className='w-full mt-6 bg-[#743B32] text-white py-2 rounded-lg text-lg font-semibold hover:bg-[#5a2a25] transition'
            >
              {currentState === 'Login' ? 'Login' : 'Sign up'}
            </button>
          </form>

          <p className='text-center text-gray-600 mt-4'>
            {currentState === 'Login' ? (
              <>
                Not a member?{' '}
                <button onClick={() => setCurrentState('Sign up')} className='text-blue-500 font-medium'>
                  Register
                </button>
              </>
            ) : (
              <>
                Already a member?{' '}
                <button onClick={() => setCurrentState('Login')} className='text-blue-500 font-medium'>
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
