import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/Table/Table";
import { Button } from "../../components/Button/Button";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "../../components/Pagination/Pagination";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useMemo, useState } from "react";
import { Input } from "../../components/Input/Input";
import avatar from "../../assets/avatar.jpg"
// import {
//   Select,
//   SelectGroup,
//   SelectValue,
//   SelectTrigger,
//   SelectContent,
//   SelectLabel,
//   SelectItem,
//   SelectSeparator,
// } from '../../Components/Select/Select';
// import * as SelectPrimitive from "@radix-ui/react-select";
// import { Check, ChevronDown, ChevronUp, EyeIcon, FilePenIcon } from "lucide-react";
import { useSelector } from 'react-redux';
import { Select } from '../../components/Select/Select';
import { SelectTrigger } from '../../components/Select/SelectTrigger';
import { SelectContent } from '../../components/Select/SelectContent';
import { SelectItem } from '../../components/Select/SelectItem';
// import { SelectSeparator } from '../../Components/Select/SelectSeparator';
// import { SelectLabel } from '../../Components/Select/SelectLabel';
import { SelectValue } from "../../components/Select/SelectValue";
import Alert from "../../components/Alert/Alert";
import { TrashIcon } from '../../components/Icons/Icons';
import { ChevronDownIcon, ChevronUpIcon, SearchIcon, VerticalEllipsisIcon } from '../../icons/icons';
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { NavLink, useNavigate } from 'react-router-dom';
import { UserDetailsModal } from '../../components/user-detail-modal/UserDetails';


const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = DropdownMenuPrimitive.Content;
const DropdownMenuItem = DropdownMenuPrimitive.Item;
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
const DropdownMenuLabel = DropdownMenuPrimitive.Label;

export function Users() {
  const queryClient = useQueryClient();
  const { darkMode } = useSelector((state) => state.darkMode);
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // State for items per page
  const [deleteObject, setDeleteObject] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();


  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }


  const columns = useMemo(
    () => [

      {
        id: 'userName',
        header: 'USERNAME',
        accessorKey: 'userName',
        cell: ({ row }) => {
          const profilePicture = row.original.profilePicture;

          const profilePictureUrl = profilePicture
            ? isValidUrl(profilePicture)
              ? profilePicture
              : `${import.meta.env.VITE_APP_API_URL}/uploads/images/${profilePicture}`
            : avatar;
          return (
            <div className="flex items-center gap-2">
              <img
                src={profilePictureUrl}
                alt={`${row.original.userName}'s profile`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{row.original.userName}</span>
            </div>
          );
        },
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
      },
      {
        id: 'country',
        header: 'Location',
        accessorKey: 'country',
      },
      {
        id: 'vocation',
        header: 'Vocation',
        accessorKey: 'vocation',
      },
      {
        id:'joined',
        header:"Joined",
        accessorKey:"joined"
      }

    ],
    []
  );

  const handleView = (row) => {
    setSelectedUser(row)
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    const updateUserData = {
      userId: row?.original?._id,
      "status": "active",
    }
    updateUserMutation.mutate(updateUserData);
  };

  const handleDelete = (row) => {
    console.log("row", row.original)
    setDeleteObject(row.original)
    setAlertOpen(!alertOpen)
  };

  const deleteVideoMutation = useMutation({
    mutationFn: async (userId) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/delete-user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userId }),
      });
      if (response?.status == 401) {
        localStorage.removeItem("authToken");
        navigate(0)
        navigate("/login")
      }
      else if (response?.status == 400) {
        localStorage.removeItem("authToken");
        navigate(0)
        navigate("/login")
      }
      else if (response?.status == 500) {
        localStorage.removeItem("authToken");
        navigate(0)
        navigate("/login")
      } else {
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['videos', currentPage, itemsPerPage]);
      setAlertOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting video:', error.message);
    },
  });


  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('authToken');
      // console.log("data.original", data._id)
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }

      );
      if (response?.status == 401) {
        localStorage.removeItem("authToken");
        navigate(0)
        navigate("/login")
      }
      else if (response?.status == 400) {
        localStorage.removeItem("authToken");
        navigate(0)
        navigate("/login")
      }
      else if (response?.status == 500) {
        localStorage.removeItem("authToken");
        navigate(0)
        navigate("/login")
      } else {
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['videos', currentPage, itemsPerPage]);
      setAlertOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting video:', error.message);
    },
  });


  // const handleSuspend = (row) => {
  //   const updateUserData = {
  //     userId: row?.original?._id,
  //     "status": "suspended"
  //   }
  //   updateUserMutation.mutate(updateUserData);

  // }



  const handleProfileUpdate = (row, data) => {
    const updateUserData = {
      userId: row?._id,
      "profileStatus": data
    }
    updateUserMutation.mutate(updateUserData);
  }

  const handleSubUpdate = (row, data) => {
    const updateUserData = {
      userId: row?._id,
      "subscriptionStatus": data
    }
    updateUserMutation.mutate(updateUserData);
  }






  const deleteVideo = () => {
    if (deleteObject) {
      deleteVideoMutation.mutate(deleteObject._id);
    }
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ['userss', currentPage, itemsPerPage],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/all?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response?.status == 401) {
        localStorage.removeItem("authToken");
        navigate(0)
        navigate("/login")
      }
      else if (response?.status == 400) {
        localStorage.removeItem("authToken");
        navigate(0)
        navigate("/login")
      }
      else if (response?.status == 500) {
        localStorage.removeItem("authToken");
        navigate(0)
        navigate("/login")
      } else {
        return response.json();
      }
    },
    keepPreviousData: true,

  });

  const tableData = useMemo(() => {
    if (data && data.success) {
      return data?.message?.users?.docs.map(user => ({
        _id: user._id,
        userName: user?.userName,
        email: user?.email,
        country: user?.country,
        createdAt: user?.createdAt,
        dob: user?.dob,
        currentStreak: user?.currentStreak,
        vocation: user?.primaryVocation,
        // videos: user?.videos,
        // likes: user?.likes,
        // profileStatus: user?.profileStatus
        profileStatus: user?.profileStatus,
        subscriptionStatus: user?.subscriptionStatus,
        profilePicture: user?.profilePicture,
        joined: new Date(user?.createdAt).toLocaleDateString()

      }));
    }
    return [];
  }, [data]);

  const totalEntries = data?.message?.users?.totalDocs || 0;
  const totalPages = data?.message?.users?.totalPages || 0;

  // Calculate the entries currently being shown
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

  const table = useReactTable({
    data: tableData,
    columns: useMemo(() => [
      ...columns,
      // {
      //   id: 'actions',
      //   header: 'Actions',
      //   cell: ({ row }) => (

      //     <div className="flex items-center gap-2">
      //       {
      //         row?.original?.profileStatus === 'suspended' ? <Button onClick={() => handleEdit(row)} variant="ghost" className="bg-green-900 opacity:0.2 text-white hover:bg-green-400 hover:text-white" >
      //           <span>active</span>
      //         </Button> : <Button onClick={() => handleSuspend(row)} variant="ghost" className="bg-red-900 opacity:0.2 text-white hover:bg-red-400 hover:text-white" >

      //           <span > suspend</span>
      //         </Button>
      //       }


      //     </div>
      //   ),
      // },
      {
        id: 'subscriptionStatus',
        header: 'Subscription Status',
        cell: ({ row }) => (

          <div className="flex items-center gap-2">
            {
              row?.original?.subscriptionStatus == 'active' ?
                <span className="bg-green-100 text-green-900 opacity-100 px-4 py-1 rounded-md">{row?.original?.subscriptionStatus}</span>
                :
                <span className="bg-red-100 text-red-900 px-4 py-1 rounded-md opacity-100" >{row?.original?.subscriptionStatus}</span>



            }


          </div>
        ),
      },
      {
        id: 'Actions',
        header: 'Actions',
        cell: ({ row }) => (

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full transition-colors  duration-300 text-foreground"
                >
                  <VerticalEllipsisIcon width={16} height={16} />


                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset="1"
                align="end"
                className="z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md transition-colors duration-300 bg-white  text-gray-800"
              >
                <DropdownMenuItem inset="4" className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 pl-8">
                  <NavLink to="/profile">
                    <span>Actions</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200 -mx-1 my-1 h-px" />
                <DropdownMenuItem inset="4" className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 pl-8">
                  {
                    row?.original?.profileStatus == 'suspended' ? <span onClick={() => handleProfileUpdate(row?.original, "active")} >Activate</span> : <span onClick={() => handleProfileUpdate(row?.original, "suspended")}> Suspend </span>
                  }


                </DropdownMenuItem>
                <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 pl-8">
                  {
                    row?.original?.subscriptionStatus == 'inactive' ? <span onClick={() => handleSubUpdate(row?.original, "active")}>Activate Payment</span> : <span onClick={() => handleSubUpdate(row?.original, "inactive")}> Inactivate Payment </span>
                  }
                </DropdownMenuItem>
                <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 pl-8">

                  <span onClick={() => handleView(row?.original)}>View Details</span>

                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200 -mx-1 my-1 h-px" />
                <DropdownMenuItem
                  onClick={() => handleDelete(row)}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 pl-8"
                >
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      }
    ], [columns]),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  const getPaginationRange = () => {
    const maxVisiblePages = 3;
    const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      return [...Array(maxVisiblePages).keys()].map(i => i + Math.max(endPage - maxVisiblePages + 1, 1));
    }

    return [...Array(endPage - startPage + 1).keys()].map(i => i + startPage);
  };

  const paginationRange = getPaginationRange();

  return (
    <div>
      <div className="flex justify-end items-center m-2">

        <div className={`w-full max-w-sm ${darkMode ? 'dark' : ""}`}>
          <Input
            type="search"
            icons={<SearchIcon width={16} height={16} strokeColor="black" />}
            iconPosition="left"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search Here"
            className="w-full max-w-sm"
          />
        </div>
        {/*<div className={`w-full max-w-sm ${darkMode ? 'dark' : ""}`}>
          <Select onValueChange={setItemsPerPage} className="w-full">
            <SelectTrigger className="placeholder" placeholder="Select an option">
              <SelectValue value={itemsPerPage} />
            </SelectTrigger>
            <div>
              <SelectContent className={`${darkMode ? 'dark' : ""}`}>
                <SelectItem value={10}>10</SelectItem>
                <SelectItem value={15}>15</SelectItem>
                <SelectItem value={20}>20</SelectItem>
                <SelectItem value={25}>25</SelectItem>
              </SelectContent>

            </div>
          </Select>
        </div>*/}
      </div>

      <div className="border rounded-xs m-2">
        <Table>
          <TableHeader>
            <TableRow>
              {table?.getHeaderGroups()?.map(headerGroup =>
                headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                          style: { cursor: 'pointer', display: 'flex' },
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                         asc: <ChevronUpIcon width={12} height={12} style={{marginLeft:"10px"}} />,
                         desc: <ChevronDownIcon width={12} height={12} style={{marginLeft:"10px"}} />,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table?.getRowModel()?.rows?.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="border-t h-15 p-2 items-center flex justify-start">
          <span className='text-sm text-muted-foreground'>  Showing {startEntry} to {endEntry} of {totalEntries} entries </span>
        </div>
        <div className="h-15 p-2 items-center flex justify-center">
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {paginationRange.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => {
                        if (page <= totalPages) {
                          setCurrentPage(page);
                        }
                      }}
                      isActive={currentPage === page}
                      className={currentPage === page ? "bg-sidebar text-white rounded-none h-8 w-8" : "bg-white h-8 w-8"}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
        <UserDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedUser}
          darkMode={darkMode}
        />
        <Alert
          open={alertOpen}
          onOpenChange={setAlertOpen}
          title="Delete User"
          description="Are you sure you want to delete this user?"
          type="delete"
          onConfirm={deleteVideo}
        />
      </div>
    </div>
  );
}



