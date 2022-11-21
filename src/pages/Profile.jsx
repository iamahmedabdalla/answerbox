import React from 'react'
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { collection, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { Tag, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';


const Profile = () => {

  const { user } = UserAuth();
  const navigate = useNavigate();

  let userUID = user.uid;

  const [questions, setQuestions] = useState([]);


  // listing all the questions users asked
  useEffect(() => {
    const getQuestions = async () => {
      const data = await getDocs(collection(db, "questions"));
      const filteredData = data.docs.filter((doc) => {
        return doc.data().createdByUid === userUID;
      });
      setQuestions(filteredData.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getQuestions();
  }, []);
  

  console.log(userUID);

  const checkQuestion = (question) => {
    if (question.answer === "") {
      return false;
    } else {
      return true;
    }
  };

  function UserQuestions() {
    return (
      <>
      {questions.length > 0 ? (
        <>
        {questions.map((question) => (
          <div className="border p-4 my-4 dark:bg-gray-900 dark:text-gray-100 hover:shadow-lg dark:hover:bg-gray-800"
            key={question.id}>
            <h3 className="text-xl font-bold dark:text-gray-100 ">
              {question && question.question
                ? question.question
                : "No question"}

            </h3>
            <p className="text-lg">
              {checkQuestion(question) ? question.answer : "No answer yet"}
            </p>
            {checkQuestion(question) ? (
              <p className="text-sm">
                {" "}
                Question Subject:{" "}
                <Tag color="magenta">{question.subject}</Tag>
              </p>
            ) : (
              null
            )}
                    <p className="text-lg">Questions Created By: {question.createdBy}</p>

            <p className="text-sm">
              {" "}
              Confidence Score: {question.confidence}
            </p>
            <p className="text-sm">
              {" "}
              Asked at: {question?.createdAt?.toDate().toDateString()}
            </p>
            <div
              className="flex footer-btns"
              style={{
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >

              <Button type="primary" ghost>
                <a
                  href={`https://www.google.com/search?q=${question.question}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  Search this question on Google
                </a>
              </Button>
            </div>
          </div>
        ))}
        </>
      ) : (
        <div className="border p-4 my-4 justify-center dark:bg-gray-900 dark:text-gray-100 hover:shadow-lg dark:hover:bg-gray-800">
          <h1 className="text-2xl font-bold text-inherit">No questions asked yet</h1>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate(-1)}>
            Come Ask Some Questions
          </button>
        </div>
      )}
       
        
      </>
    )
  }


  return (
    <div className="p-5 h-screen dark:bg-gray-900 dark:text-gray-100 overflow-scroll">
      <button className='flex flex-row items-center justify-center mb-5 p-2 rounded-md bg-[#1DA1F2] hover:bg-[#58bdfb]'>
        <ArrowLeftOutlined className='text-gray-500' />
        <span className='text-black dark:text-white  ml-2' onClick={() => navigate('/account')}>Back to Account</span>
      </button>
      <div className="flex flex-col items-start bg-slate-300 dark:bg-gray-800 dark:text-gray-100 p-4 rounded-lg">
        <h1 className="text-2xl text-inherit font-bold">Profile</h1>
        <p className="text-lg">Name: {user.displayName}</p>
        <p className="text-lg">Email: {user.email}</p>
        <p className="text-lg">Questions Asked: {questions.length}</p>
        <p className="text-lg">Date Joined: {user.metadata?.creationTime}</p>
      </div>
      <div className='flex flex-col h-screen '>
        <h1 className="text-2xl py-3 text-inherit font-bold">Questions You've Asked</h1>
        <UserQuestions />
      </div>
    </div>
  );
};


export default Profile