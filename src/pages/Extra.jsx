import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { Slider, Skeleton, message, Drawer, Tag, Button, Alert, Segmented } from "antd";
import { Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import "antd/dist/antd.min.css";
import { MoreOutlined } from "@ant-design/icons";
import "../index.css";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { data } from "autoprefixer";
const Extra = () => {
    const [questions, setQuestions] = useState("");

    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (user.uid !== "OZXkHPwsSUhO5GWBDBYLGcqjZ6H3") {
                navigate(-1);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, []);
    

    useEffect(() => {
        const getQuestions = async () => {
            const data = await getDocs(collection(db, "randomQuestions"));
            const sortedData = data.docs.sort((a, b) => {
                return b.data().createdAt - a.data().createdAt;
            });
            setQuestions(sortedData.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getQuestions();
    }, []);

   const userCheck = () => {
        if (user.uid === "OZXkHPwsSUhO5GWBDBYLGcqjZ6H3") {
            return (
              <>
              <div className="bg-gray-100 p-5 dark:bg-inherit dark:text-white">
        <h1 className="text-2xl font-bold text-center dark:text-white">
        Number of questions: {questions.length}
        </h1>
        <button 
        onClick={() => {navigate(-1)}}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Go Back
        </button>
        {questions ? (
          questions.map((question) => (

            <div className="border  p-4 my-4" key={question.id}>
              <h3 className="text-xl dark:text-white font-bold">
                {question && question.question
                  ? question.question
                  : "No question"}
              </h3>
                <p className="text-gray-500">
                    {question && question.answer
                        ? question.answer
                        : "No answer"}
                </p>
                <p className="text-gray-500">
                    {question && question.createdAt ? 
                        question.createdAt.toDate().toDateString() : "No date"}
                </p>
                <p className="text-gray-500">
                  Device Type: {question.DeviceType}
                </p>

              
              
              
            </div>
          ))
        ) : (
          <Skeleton active />
        )}
        
    </div>
              </>
            )
        } else {
            return (
                <div className="bg-gray-100 h-screen dark:bg-inherit dark:text-white">
                    <div className="flex flex-col justify-center items-center h-full">
                        <h1 className="text-2xl font-bold text-center dark:text-white">
                            Very Curious, aren't you?
                        </h1>
                        <h1 className="text-2xl font-bold text-center dark:text-white">
                        Nah, you're not allowed to see this page.
                        </h1>
                      </div>
                </div>                
            ) 
        }
    };




  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-800 dark:text-white">
        
      
      {userCheck()}
      </div>
    </>
  
    
  )
}

export default Extra