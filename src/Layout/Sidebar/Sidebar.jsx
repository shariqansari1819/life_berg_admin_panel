import React from 'react';
import logo from '../../assets/Full Logo.svg'
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='font-bold  h-screen min-h-full bg-sidebar text-white'>
      <div className='py-6'>
        <img src={logo} alt="logo..." />
      </div>
      <nav className="flex flex-col">
        {/* <NavLink to="/" className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-200 hover:bg-opacity-90 ${isActive ? 'bg-blue-200 bg-opacity-70' : ''}`
        }
        >
          <HomeIcon className="h-5 w-5" />
          Dashboard
        </NavLink> */}
        <NavLink to="users" className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-200 hover:bg-opacity-90 ${isActive ? 'bg-blue-200 bg-opacity-70' : ''}`
        }
        >
          {/*<Users2Icon className="h-5 w-5" />*/}
          Manage App Users
        </NavLink>

        <NavLink to="news-articles" className={({ isActive }) =>
          `flex items-center gap-3 p-4 py-3 text-sm font-medium transition-colors  hover:bg-blue-200 hover:bg-opacity-90 ${isActive ? 'bg-blue-200 bg-opacity-70 font-bold' : ''}`
        }
        >
          {/*<VideoIcon className="h-5 w-5" />*/}
          Manage App Content
        </NavLink>
        <NavLink to="banner" className={({ isActive }) =>
          `flex items-center gap-3 p-4 py-3 text-sm font-medium transition-colors  hover:bg-blue-200 hover:bg-opacity-90 ${isActive ? 'bg-blue-200 bg-opacity-70 font-bold' : ''}`
        }
        >
          {/*<VideoIcon className="h-5 w-5" />*/}
          Manage App Banner
        </NavLink>
        <NavLink to="order-content" className={({ isActive }) =>
          `flex items-center gap-3 p-4 py-3 text-sm font-medium transition-colors  hover:bg-blue-200 hover:bg-opacity-90 ${isActive ? 'bg-blue-200 bg-opacity-70 font-bold' : ''}`
        }
        >
          {/*<VideoIcon className="h-5 w-5" />*/}
          Order App Content
        </NavLink>
        {/* <NavLink to="reports" className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors  hover:bg-blue-200 hover:bg-opacity-90 ${isActive ? 'bg-blue-200 bg-opacity-70' : ''}`
        }
        >
          <ClipboardCopyIcon className="h-5 w-5" />
          Live Analytics and Reporting
        </NavLink> */}

      </nav>
    </div>
  )
}

export default Sidebar
