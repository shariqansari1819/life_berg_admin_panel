import React from 'react'
import Sidebar from './Sidebar/Sidebar'
import Header from './Header/Header'
import Main from './Main/Main'
import Footer from './Footer/Footer'

const Layout = () => {
  const authToken = localStorage.getItem('authToken');

  return (
    <div className='flex'>

      {authToken &&
        <div className={`${authToken ? "w-[calc(250px)]" : "w-full"}`}>
          <Sidebar />
        </div>}
      <div className={`${authToken ? "w-[calc(100%-250px)]" : "w-full"}`}>
        {authToken && <Header />}

        <Main />
        {/* {authToken && <Footer />} */}
      </div>
    </div>
  )
}

export default Layout
