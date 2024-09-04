import React from 'react'
import { BellIcon, ChevronDownIcon, SearchIcon } from '../../icons/icons';
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Button } from '../../components/Button/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { NavLink, useNavigate } from 'react-router-dom';




const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = DropdownMenuPrimitive.Content;
const DropdownMenuItem = DropdownMenuPrimitive.Item;
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
const Header = () => {

  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate(0)
    navigate("/login")
  }


  return (
    <div className='flex justify-between text-center items-center h-20 px-4 w-100 bg-white shadow-xs border-b-2 border-muted'>
      <div className='font-bold'>
        Dashboard
      </div>
      <div className='flex'>
        {/* <span className="bg-muted rounded p-2 mr-2 relative h-min cursor-pointer">
          <SearchIcon width={16} height={16} strokeColor="black" />
        </span> */}
        {/* <span className="bg-muted rounded p-2 relative h-min cursor-pointer">
          <BellIcon width={16} height={16} strokeColor="black" />
          <span className="-top-1 left-6 absolute  w-3.5 h-3.5 bg-red-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
        </span> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full transition-colors  duration-300 text-foreground"
            >
              {/* <div className="rounded-full bg-gray-100 h-8 w-8 flex justify-center items-center mr-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                  <AvatarFallback>UZ</AvatarFallback>
                </Avatar>
              </div> */}
              <div>
                <div className="flex items-center mr-2">
                  <span className="text-lg font-medium text-foreground">Ubaid Ziad</span>
                </div>
                <span className="text-sm text-muted-foreground">Admin</span>
              </div>
              <div>
                <ChevronDownIcon width={16} height={16} strokeColor="black" />
              </div>


            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            sideOffset="1"
            align="end"
            className="z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md transition-colors duration-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          >
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 leading-none">
                <div className="font-semibold">Ubaid Ziad</div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">
                  john@example.com
                </div>
              </div>
            </div>
            {/* <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700 -mx-1 my-1 h-px" /> */}
            {/* <DropdownMenuItem inset="4" className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:text-gray-900 dark:hover:text-white text-gray-800 dark:text-gray-100 pl-8">
              <NavLink to="/profile">
                <span>Profile</span>
              </NavLink>
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:text-gray-900 dark:hover:text-white text-gray-800 dark:text-gray-100 pl-8">
              <NavLink to="/settings">
                <span>Settings</span>
              </NavLink>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700 -mx-1 my-1 h-px" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:text-gray-900 dark:hover:text-white text-gray-800 dark:text-gray-100 pl-8"
            >
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>




      </div>
    </div>
  )
}

export default Header
