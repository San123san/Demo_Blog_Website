// main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './reduxstore/store';
import App from './App.jsx'
// import './index.css'
import HomePage from './pages/HomePage.jsx'
// import HomeSignUp from './components/Home.jsx'
import BlogCreateCard from './Blog/BlogCreateCard.jsx'
import BlogAllCard from './Blog/BlogAllCard.jsx'
import BlogYourCard from './Blog/BlogYourCard.jsx'
import SignInUser from './userAuth/SignInUser.jsx'
import SignUpUser from './userAuth/SignUpUser.jsx'
import { Provider } from 'react-redux'
import BlogEditCard from './Blog/BlogEditCard.jsx'
import AllCardShow from './components/AllCardShow.jsx'
import UserCardShow from './components/UserCardShow.jsx'
import Dashboard from './components/DashBoard.jsx'
import Home from './components/Home.jsx';
import SearchPage from './components/SearchPage.jsx';
import ShareBlogByOther from './Blog/ShareBlogByOther.jsx';
import ShareBlogByYou from './Blog/ShareBlogByYou.jsx';
import { ThemeProviderWrapper } from './ThemeContext.jsx';
import ShareBlogCardShowOther from './components/ShareBlogCardShowOther.jsx';
// import ThemeWrapper from './ThemeWrapper.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <ThemeProviderWrapper>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signin' element={<SignInUser />} />
          <Route path='/signup' element={<SignUpUser />} />
          <Route path='/blogallCard' element={<BlogAllCard />} />
          <Route path='/blogyourcard' element={<BlogYourCard />} />
          <Route path='/blog-create-card' element={<BlogCreateCard />} />
          <Route path='/blog-edit-card' element={<BlogEditCard />} />
          <Route path='/All-Card-Show/:topic' element={<AllCardShow />} />
          <Route path='/User-Card-Show/:topic' element={<UserCardShow />} />
          <Route path='/shareblogbyother' element={<ShareBlogByOther />} />
          <Route path='/shareblogbyyou' element={<ShareBlogByYou />} />
          {/* //Home */}
          <Route path='/home' element={<Home />} />
          {/* //dashboard */}
          <Route path='/dashboard' element={<Dashboard />} />
          {/* SearchQuery */}
          <Route path='/searchpage/:searchQuery' element={<SearchPage />} />
          <Route path='/share-blog-Card-show-other/:topic' element={<ShareBlogCardShowOther />} />
        </Routes>
      </Router>
      </ThemeProviderWrapper>
    </Provider>
  </React.StrictMode>,
)
