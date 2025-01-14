import React from 'react'
import Sidebar from './Sidebar/Sidebar'
import Header from './Header/Header'
import Main from './Main/Main'
import Footer from './Footer/Footer'

const Layout = () => {
  const authToken = localStorage.getItem('authToken');

  return (
    <div className='flex h-full' >

      {authToken &&
        <div className={`${authToken ? "w-[calc(250px)]" : "w-full"} relative`}>
          <Sidebar />
        </div>}
      <div
        className={`${authToken ? "w-[calc(100%-250px)]" : "w-full"
          } overflow-y-auto`}
        style={{ height: '100vh' }} // Ensure the main content area takes full height
      >
        {authToken && <Header />}
        <Main />
        {/* {authToken && <Footer />} */}
      </div>
    </div>
  )
}

export default Layout
