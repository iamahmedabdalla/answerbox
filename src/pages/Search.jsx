
import React, {useEffect, useState} from 'react'
import { Button, Alert, Skeleton, message } from 'antd'
import { Link } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { ArrowLeftOutlined } from '@ant-design/icons'


const Search = () => {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [width, setWidth] = useState(window.innerWidth)

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

    const handleSubmit = async (e) => {
      if (question === '') {
        setError('Please enter a question')
        return
      }
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        try {
            const response = await fetch('https://api.openai.com/v1/engines/text-curie-001/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: 'Parse Unstructured Text' + question + '.',
            max_tokens: 100,
            temperature: 0.9,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ['.'],
          }),
        })
        const data = await response.json()
        setAnswer(data.choices[0].text)
        setLoading(false)
        try {
            await addDoc(collection(db, 'randomQuestions'), {
                question: question,
                answer: data.choices[0].text,
                createdAt: serverTimestamp(),
                DeviceType: DeviceType,
            })
            } catch (error) {
                console.log(error.message)
            }
    } catch (error) {
        setError('Error generating answer')
        setLoading(false)
    }
  }


  


   const InputPlaceholdersWithAnswers = [
    {
      question: 'What is Information Technology?',
      answer: 'Information technology (IT) is the use of computers to store, retrieve, transmit, and manipulate data, or information, often in the context of a business or other enterprise. IT is considered to be a subset of information and communications technology (ICT).'
    },
    {
      question: 'What is database?',
      answer: 'A database is an organized collection of data, generally stored and accessed electronically from a computer system. Where databases are more complex they are often developed using formal design and modeling techniques.'
    },
    {
      question: 'What is Telegram Bot?',
      answer: 'A Telegram bot is a type of bot software that runs automated tasks (scripts) over the Telegram Messenger app. Users interact with the bot by sending it messages, commands and inline requests. The bot then sends back automated replies.'
    },
    {
      question: 'What is the capital of Spain?',
      answer: 'Madrid is the capital of Spain and the largest municipality in both the Community of Madrid and Spain as a whole. The city has a population of almost 3.3 million within its administrative limits on a land area of 604.3 km2 (233.3 sq mi).'
    }
   ]

    const randomQuestion = InputPlaceholdersWithAnswers[Math.floor(Math.random() * InputPlaceholdersWithAnswers.length)]


 
  return (
    <div className="container p-5">
    <div className='max-w-[2400px] mx-auto p-4'>
      <div className='flex flex-row justify-between items-center'>
        <button className='flex flex-row items-center justify-center p-2 dark:text-white rounded-md bg-[#1DA1F2] hover:bg-[#58bdfb]'>
          <ArrowLeftOutlined className='text-gray-50 ' />
          <Link to='/'>
            <span className=' text-white ml-2'> Back to Home</span>
          </Link>
        </button>
        <Link to='/feedback'> Give Feedback </Link>
      </div>
      
      <form className='flex flex-col py-4' onSubmit={handleSubmit}>

        <label htmlFor='question'>Enter Question Here</label>
        <textarea id='question' value={question} onChange={(e) => setQuestion(e.target.value)} className='border p-2 my-2 question dark:bg-inherit dark:text-white' 
        placeholder={randomQuestion.question} />
        
        
        <Button loading={loading} icon type='primary' style={{
          backgroundColor: '#1DA1F2',
        }} onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-700 text-white border px-6 py-2 my-4 text-light bg-secondary '>
            Generate / Refresh Answer
        </Button>
        <label htmlFor='answer'>Answer</label>
        {
          error && <Alert message={error} type="error" />
        }
        {
          success && <Alert message={success} type="success" />
        }
        
        
        {loading ? <Skeleton active /> :

          <textarea id='answer' value={answer} onChange={(e) => setAnswer(e.target.value)} className='border p-2 my-2 answer_area dark:text-white dark:bg-inherit ' 
          placeholder={randomQuestion.answer} 
          />

        }
        <div className='text-lg font-semibold text-blue-600'>
            For better experience <Link to='/signup'>Sign up</Link> or <Link to='/signin'>Sign in</Link>
        </div>
      
      </form>
    </div>
  </div>

  )
}

export default Search