import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { Slider, Skeleton, message,Dropdown, Menu, Space, Avatar, Alert } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
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
import Item from 'antd/lib/list/Item';

const Account = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [subject, setSubject] = useState('');
  const [alength, setAlength] = useState(0);
  const [counter, setCounter] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);

  const [username, setUsername] = useState('');

  const [balance, setBalance] = useState(0);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loading, setLoading] = useState(false);
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  // check how many questions user has asked
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
 
  //  generate users balance from users table in firestore
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

 



  // get the input question from the user
  // if the question is already in the database, then get the answer from the database
  // if the question is not in the database, then get the answer from the api, and then add the question and answer to the database
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
        // get the answer from the openai api
        const response = await fetch('https://api.openai.com/v1/engines/text-babbage-001/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: 'Answer this question: ' + question + '.',
            max_tokens: alength,
            temperature: 0.9,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        });
        const data = await response.json();
        setAnswer(data.choices[0].text);
        // count the number of times the user has used the api
        setCounter(counter + 1);
        // add the question and answer to the database
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

  // get user name from firestore
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
  />
);





return (
  <div className="container">
    <div className='max-w-[2400px] mx-auto p-4'>
      <div className='flex justify-between items-center'>
      <Link to='/answers'>
        <button className='border px-6 py-2 my-4'>Answers</button>
      </Link>
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
        <label htmlFor='question'>Question</label>
        <textarea id='question' value={question} onChange={(e) => setQuestion(e.target.value)} className='border p-2 my-2' placeholder='Enter your question' />

        <div className='sliders'>
          <div className='alength'>
            <label htmlFor='alength'>Answer Length</label>
            <Slider id='alength'
              max={2000} value={alength} onChange={(value) => setAlength(value)} />
            <div className='alength-value'>{alength}</div>
          </div>
          <div className='alength'>
            <label htmlFor='subject' required>Which subject is this</label>
            <select id='subject' value={subject} onChange={(e) => setSubject(e.target.value)} className='border p-2 my-2' required >
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

        <button onClick={handleSubmit} className='border px-6 py-2 my-4 text-light bg-secondary'>
          Generate / Refresh Answer
        </button>
        {
          error && <Alert message={error} type="error" />
        }
        {
          success && <Alert message={success} type="success" />
        }
        
        
        {loading ? <Skeleton active /> :
          <div className=''>
          <button className='border px-6 py-2 my-4 upload-btn'>
           Save Answer
         </button>
          <textarea id='answer' value={answer} onChange={(e) => setAnswer(e.target.value)} className='border p-2 my-2 answer_area' placeholder='Answer will appear here' />
          </div>
        }
       

      </form>
    </div>
  </div>
);
}




export default Account;
