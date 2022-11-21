// PAGES
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Answers from './pages/Answers';
import Profile from './pages/Profile';
import Index from './pages/Index';
import Search from './pages/Search';
import Extra from './pages/Extra';
import Feedback from './pages/Feedback';
import PageNotFound from './pages/PageNotFound';
// Routes
import { Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
// ant d 
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App dark:bg-gray-900 dark:text-gray-50 h-full ">
      <div className='container'>
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/search' element={<Search />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='*' element={<PageNotFound />} />

          <Route
            path='/account'
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path='/answers'
            element={
              <ProtectedRoute>
                <Answers />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/extra'
            element={
              <ProtectedRoute>
                <Extra />
              </ProtectedRoute>
            }
          />

          

        </Routes>
      </AuthContextProvider>
      </div>
    </div>
  );
}

export default App;
