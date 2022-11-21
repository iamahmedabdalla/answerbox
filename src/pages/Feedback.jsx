import React, {useState, useEffect} from 'react'
import  { db }  from   '../firebase' ;
import  { collection, addDoc, serverTimestamp }  from   'firebase/firestore' ;
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton, message, Button } from 'antd';
import { UserAuth } from '../context/AuthContext';




const Feedback = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { user } = UserAuth();

    const navigate = useNavigate();

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        if ( message === "") {
            setError("Please fill Message field");
            setLoading(false);
            return;
        }
        try {
            await addDoc(collection(db, "feedback"), {
                name: name,
                email: email,
                message: message,
                createdAt: serverTimestamp(),
            });
            setSuccess("Thank you for your feedback");
            setLoading(false);
            setTimeout(() => {
                navigate("/search");
            }, 2000);
            return
        } catch (error) {
            setError("Feedback not sent");
            setLoading(false);
        }
    };




  return (
    <>
    
    <div className="flex flex-col p-5">
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
        <div className='flex flex-col items-start justify-start w-full  p-1'>
        <Button 
        type="primary" 
        >
        <Link to={user ? "/account" : "/search"}
        >Back to Search</Link>
        </Button>
        </div>
        <div className="flex flex-col items-center justify-center w-full flex-1 text-center">
            <h1 className="text-6xl font-bold dark:text-gray-300">
                Feedback Form
            </h1>
            <p className=" text-2xl">
            I am always looking for ways to improve this product.
            </p>
            <p className="text-2xl">
            Let me know what you think!
            </p>
            <div className="flex flex-col items-center justify-center w-full flex-1 text-center">
                {
                    loading ? (
                        <Skeleton active />
                    ) : (
                        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                Name
                            </label>
                            <input 
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white dark:bg-inherit" id="grid-first-name" type="text" placeholder="" />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                Email
                            </label>
                            <input 
                                onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-inherit" id="grid-password" type="email" />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                Message
                            </label>
                            <textarea 
                                onChange={(e) => setMessage(e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-inherit" id="grid-password" type="email" placeholder="" />
                        </div>
                    </div>
                    <div className="md:flex md:items-center">
                        <div className="md:w-1/3">
                            <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 w-full rounded " type="submit">
                                Send
                            </button>
                        </div>
                        <div className="md:w-2/3"></div>
                    </div>
                    {
                        error && <p className="text-red-500">{error}</p>
                    }
                    {
                        success && <p className="text-green-500">{success}</p>
                    }
                    
                </form>
                    )
                }
            </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default Feedback