import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { Slider, Skeleton, message,Dropdown, Space, Menu, Avatar, Alert, Button, } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import 'antd/dist/antd.min.css';
import '../index.css';
import {
  addDoc,
  collection,
  getDoc,
  setDoc,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from '../firebase';


const Account = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [subject, setSubject] = useState('');
  const [counter, setCounter] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);

  const [username, setUsername] = useState('');

  const [balance, setBalance] = useState(0);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loading, setLoading] = useState(false);
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const DeviceType = width <= 768 ? 'mobile' : 'desktop';


  useEffect(() => {
    const getQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      querySnapshot.forEach((doc) => {
        if (doc.data().email === user.email) {
          setQuestionsAsked((prev) => prev + 1);
        }
      });
    };
    getQuestions();
  }, [user.email]);
 
  useEffect(() => {
    const getBalance = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        if (doc.data().email === user.email) {
          setBalance(doc.data().balance);
        }
      });
    };
    getBalance();
  }, [user.email]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (question === '') {
      setError('Please enter a question');
      setLoading(false);
      return;
    }
    if (subject === '') {
      setError('Please select a subject');
      setLoading(false);
      return;
    }
    try {
      const qRef = collection(db, 'questions');
      const qSnapshot = await getDocs(qRef);
      const qList = qSnapshot.docs.map((doc) => doc.data());
      const q = qList.find((q) => q.question === question);
      if (q) {
        setAnswer(q.answer);
        setSuccess('Answer found in database');
      } else {
        const response = await fetch('https://api.openai.com/v1/engines/text-curie-001/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: 'default-parse-data' + question + '.',
            max_tokens: 200,
            temperature: 0.9,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ['.'],
            
          }),
        });
        const data = await response.json();
        setAnswer(data.choices[0].text);
        setCounter(counter + 1);
        setLoading(false);
        try {
          await addDoc(collection(db, 'questions'), {
            question: question,
            answer: data.choices[0].text,
            confidence: 1,
            approvedBy: '',
            disapprovedBy: '',
            createdBy: user.email,
            createdByUid: user.uid,
            subject: subject,
            createdAt: serverTimestamp(),
            DeviceType: DeviceType,
          });
          await addDoc(collection(db, 'randomQuestions'), {
            question: question,
            answer: data.choices[0].text,
            DeviceType: DeviceType,
            createdAt: serverTimestamp(),
          });
        }
        catch (error) {
          setError(error.message);
        }
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            balance: balance - 1,
          });
        }
        catch (error) {
          setError(error.message);
        }
      }
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getName = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        if (doc.data().email === user.email) {
          setUsername(doc.data().name);
        }
      });
    };
    getName();
  }, [user.email]);
  
const handleLogout = async () => {
  try {
    setError('');
    setLoading(true);
    await logout();
    navigate('/');
  } catch {
    setError('Failed to log out');
  }
  setLoading(false);
}

const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: (
          <Link to="/profile" style={{
            textDecoration: 'none',
            color: 'white',
          }}> Profile </Link>
        ),
      },
      {
        key: '2',
        danger: true,
        label: (
          <a onClick={handleLogout}> Logout </a>
        )
      },
      
    ]}
    style={{
      backgroundColor: '#111827',
      
    }}
  />
);

return (
  <div className="container min-h-screen">
    <div className='max-w-[2400px] mx-auto p-4'>
      <div className='flex justify-between items-center'>
      {
        user && (<>
        <div className='flex items-center'>
        <Link to='/answers'>
        <button className='border px-6 py-2 my-4'>Answers</button>
      </Link>
      {user.uid === 'OZXkHPwsSUhO5GWBDBYLGcqjZ6H3' && (
        <Link to='/extra'>
        <button className='border px-6 py-2 my-4'>Extra</button>
      </Link>
      )}
      <Link to='/feedback'>
        <button className='border px-6 py-2 my-4'>Feedback</button>
      </Link>
      </div>
        </>
          
        )
      }
      <Dropdown overlay={menu}>
    <a onClick={(e) => e.preventDefault()} style={{
      textDecoration: 'none',
    }} >
      <Space>
        <Avatar size="large" icon={<UserOutlined />}  style={{
          backgroundColor: '#1890ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} /> {username}
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
      </div>
      
      <form className='flex flex-col' onSubmit={handleSubmit}>
        <label htmlFor='question'>Questions</label>
        
        
        <textarea id='question' value={question} onChange={(e) => setQuestion(e.target.value)} className='border p-2 my-2 dark:bg-inherit' placeholder='Enter your question' />

        <div className='sliders'>
          
          
          <div className='alength'>
            <label htmlFor='subject' className='mr-10' required>Which subject is this</label>
            <select id='subject' value={subject} onChange={(e) => setSubject(e.target.value)} className='border p-2 my-2 dark:bg-inherit'>
              <option value=''>Select a subject</option>
              <option value='Maths'>Maths</option>
              <option value='Information Technology'>Information Technology</option>
              <option value='Science'>Science</option>
              <option value='Medical'>Medical</option>
              <option value='Languages'>Languages</option>
              <option value='Information'>Information</option>
              <option value='Law'>Law</option>
              <option value='Other'>Other</option>
            </select>

          </div>
          
        </div>

        <button onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-700 text-white border px-6 py-2 my-4 text-light bg-secondary '>
          Generate / Refresh Answer
        </button>
        {
          error && <Alert message={error} type="error" />
        }
        {
          success && <Alert message={success} type="success" />
        }
        
        
        {loading ? <Skeleton active /> :

          <textarea id='answer' value={answer} onChange={(e) => setAnswer(e.target.value)} className='border p-2 my-2 answer_area dark:bg-inherit' placeholder='Answer will appear here' />

        }
       

      </form>
    </div>
  </div>
);
}




export default Account;
