import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('')
  const { createUser } = UserAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      await createUser(name, email, password, isMobile)
      navigate('/account')
    }
    catch (e) {
      setError(e.message)
      console.log(e.message)
    }
  }
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);
  
  const isMobile = width <= 768;

return (
    <div className="signup">
  <div className='max-w-[700px] max-h-full mx-auto my-16 p-4 dark:text-gray-200'>
    <div>
      <h1 className='text-2xl font-bold py-2 dark:text-gray-200'>Sign up for a free account</h1>
      <p className='py-2'>
        Already have an account{' '}
        <Link to='/signin' className='text-blue-500'>
          Sign in.
        </Link>
      </p>
    </div>
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col py-2'>
        <label className='py-2 font-medium'>Name</label>
        <input onChange={(e) => setName(e.target.value)} 
                className='border p-3 rounded-md dark:bg-inherit' 
                type='text' />
        <label className='py-2 font-medium'>Email Address</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className='border p-3 rounded-md dark:bg-inherit'
          type='email'
        />
      </div>
      <div className='flex flex-col py-2'>
        <label className='py-2 font-medium'>Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          className='border p-3 rounded-md dark:bg-inherit'
          type='password'
        />
      </div>
      <div className='flex flex-col py-2'>
        <label className='py-2 font-medium'>Confirm Password</label>
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          className='border p-3 rounded-md dark:bg-inherit'
          type='password'
        />
      </div>
      <button className='border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 rounded-md text-white'>
        Sign Up
      </button>
      
      {
        error && <p className='text-red-500'>{error}</p>
      }
    </form>
  </div>
</div>
);
};

export default Signup;
