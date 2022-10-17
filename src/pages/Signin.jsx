import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { Modal, message, Button, Alert } from 'antd';
import 'antd/dist/antd.css';
import { async } from '@firebase/util';


const Signin = () => {
   
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgotPassword, setForgotPassword] = useState('');
  
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const {resetPassword } = UserAuth();
  
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { signIn } = UserAuth();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('')
      try {
        await signIn(email, password)
        navigate('/account')
      } catch (e) {
        setError(e.message)
        console.log(e.message)
      }
    };
  
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
  
    // handle forgot password
    const handleForgotPassword = async () => {
      try {
        await resetPassword(forgotPassword);
        message.success('Password reset email sent');
        setIsModalOpen(false);
      } catch (error) {
        message.error(error.message);
      }
    }
  
  

  return (
    <div className='max-w-[700px] mx-auto my-16 p-4'>
      <div>
        <h1 className='text-2xl font-bold py-2'>Sign in to your account</h1>
      </div>
      <form >
        <div className='flex flex-col py-2'>
            <label className='py-2 font-medium'>
                Email
            </label>
            <input
                className='shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
        </div>
        <div className='flex flex-col py-2'>
            <label className='py-2 font-medium'>
                Password
            </label>
            <input
                className='shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
        </div>
        <div className='flex flex-col py-2'>
            <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                type='submit'
                onClick={handleSubmit}
                >
                Sign In
            </button>
        </div>
        <div className='flex flex-col py-2'>
            <Link   
                to='/signup' 
                className='text-blue-500 hover:text-blue-700'
                > Don't have an account? Sign up</Link>
        </div>
        <div className='flex flex-col py-2'>
            <a onClick={showModal} className='text-blue-500 hover:text-blue-700'>Forgot Password?</a>
            <Modal title="Reset Password" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <input 
            type="text" 
            className='border p-2 my-2' 
            placeholder="Enter your email"
            onChange={(e) => setForgotPassword(e.target.value)}
            required/>
        <button className='border px-6 py-2 my-4' onClick={handleForgotPassword} >Send Reset Link</button>
      </Modal>
        </div>
        {
          error && <Alert message={error} type="error" showIcon />
        }
      
      </form>
    </div>
  );
};

export default Signin;
