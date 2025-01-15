import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/Table/Table";
import { Button } from "../../components/Button/Button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "../../components/Pagination/Pagination";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../../components/Input/Input";
import avatar from "../../assets/avatar.jpg";

import { useSelector } from "react-redux";

import Alert from "../../components/Alert/Alert";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  VerticalEllipsisIcon,
} from "../../icons/icons";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { NavLink, useNavigate } from "react-router-dom";
import { UserDetailsModal } from "../../components/user-detail-modal/UserDetails";
import moment from "moment";
import { ArticlesModal } from "../../components/NewsArticleModal/ArticleModal";
import { AddArticlesModal } from "../../components/AddArticleModal/AddArticleModal";
import { EditArticlesModal } from "../../components/EditArticleModal/EditArticleModal";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = DropdownMenuPrimitive.Content;
const DropdownMenuItem = DropdownMenuPrimitive.Item;
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
const DropdownMenuLabel = DropdownMenuPrimitive.Label;

export function NewsArticles() {
  const [articleList, setArticleList] = useState([]);

  const queryClient = useQueryClient();
  const { darkMode } = useSelector((state) => state.darkMode);
  const [globalFilter, setGlobalFilter] = useState("");


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // State for items per page
  const [deleteObject, setDeleteObject] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedEditArticle, setSelectedEditArticle] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [order, setOrder] = useState("desc");
  const navigate = useNavigate();
  var totalEntries;
  var totalPages;




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
        id: "title",
        header: "POSTNAME",
        accessorKey: "title",
        cell: ({ row }) => {
          const profilePicture = row.original.profilePicture;
          const profilePictureUrl = profilePicture
            ? `${import.meta.env.VITE_APP_BASE_URL
            }/uploads/images/${profilePicture}`
            : avatar;
          return (
            <div className="flex items-center gap-2">
              <img
                src={profilePictureUrl}
                alt={`${row.original.title}'s profile`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span
                className="truncate w-[250px] whitespace-nowrap overflow-hidden"
                title={row.original.title}
              >
                {row.original.title}
              </span>
            </div>
          );
        },
      },

      {
        id: "type",
        header: "Category",
        accessorKey: "type",
      },
      {
        id: "readTime",
        header: "Read Time",
        accessorKey: "readTime",
      },

      {
        id: "publishedTime",
        header: "Uploaded At",
        accessorKey: "publishedTime",
        cell: ({ row }) => {
          return moment(row.original.publishedTime).format("MMM D, YYYY");
        },
      },

    ],
    []
  );

  const handleView = (row) => {
    // console.log("row for view", row.original)
    setSelectedArticle(row?.original?._id);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    const updateUserData = {
      userId: row?.original?._id,
      status: "active",
    };
    updateUserMutation.mutate(updateUserData);
  };

  const handleDelete = (row) => {
    console.log("row", row.original);
    setDeleteObject(row.original);
    setAlertOpen(!alertOpen);
  };

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId) => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/news-article/delete `,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: articleId }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error deleting video");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["videos", currentPage, itemsPerPage]);
      setAlertOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting video:", error.message);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("authToken");
      // console.log("data.original", data._id)
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/user/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["videos", currentPage, itemsPerPage]);
      setAlertOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting video:", error.message);
    },
  });


  const handleEditArticle = (row) => {

    setSelectedEditArticle(row?.original?._id);
    console.log("edit article", row?.original)
    // setSelectedArticle(row?.original?._id);
    setIsEditModalOpen(true);

  };



  const handleAdd = () => {

    setIsAddModalOpen(true);
  };

  const handleSubUpdate = (row, data) => {
    const updateUserData = {
      userId: row?._id,
      subscriptionStatus: data,
    };
    updateUserMutation.mutate(updateUserData);
  };

  const deleteVideo = () => {
    if (deleteObject) {
      deleteArticleMutation.mutate(deleteObject._id);
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["articles", currentPage, itemsPerPage, order],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL
        }/news-article/all?page=${currentPage}&limit=${itemsPerPage}&filter=${order}&order=${1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.status == 401) {
        localStorage.removeItem("authToken");
        navigate(0);
        navigate("/login");
      } else if (response?.status == 400) {
        localStorage.removeItem("authToken");
        navigate(0);
        navigate("/login");
      } else if (response?.status == 500) {
        localStorage.removeItem("authToken");
        navigate(0);
        navigate("/login");
      } else {
        return response.json();
      }
    },
    keepPreviousData: true,
  });


  useEffect(() => {
    if (data?.message?.newsArticles) {
      const mappedData = data?.message?.newsArticles?.docs.map((article) => ({
        _id: article._id,
        title: article?.title,
        description: article?.description,
        type: article?.type,
        readTime: article?.readTime,
        publishedTime: article?.publishedTime,
        currentStreak: article?.currentStreak,
        profilePicture: article?.media?.url,
        subCategory: article?.subCategory?.name,
        category: article?.subCategory?._id,
        author: article?.author,
      }))
      setArticleList(mappedData);

    }
  }, [data]);

  totalEntries = data?.message?.newsArticles?.totalDocs || 0;
  totalPages = data?.message?.newsArticles?.totalPages || 0;




  // Calculate the entries currently being shown
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

  var table = useReactTable({
    data: articleList,
    columns: useMemo(
      () => [
        ...columns,

        {
          id: "moredetails",
          header: "More Details",
          cell: ({ row }) => (
            <div className="flex items-center">
              <span
                className="cursor-pointer border-blue-600 border-2 text-blue-600 px-4 py-1 rounded-full"
                onClick={() => handleView(row)}
              >
                view more details
              </span>
            </div>
          ),
        },
        {
          id: "Actions",
          header: "Actions",
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

                  <DropdownMenuItem
                    onClick={() => handleEditArticle(row)}
                    inset="4"
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 pl-4 pr-8 justify-start"
                  >
                    <span>Edit this content</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-gray-200 -mx-1 my-1 h-px" />

                  <DropdownMenuItem
                    onClick={() => handleDelete(row)}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 pl-4 pr-8 justify-start"
                  >
                    <span>Delete this content</span>

                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        },
      ],
      [columns]
    ),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  const getPaginationRange = () => {
    const maxVisiblePages = 3;
    if (totalPages <= maxVisiblePages) {
      return [...Array(totalPages).keys()].map((i) => i + 1);
    }
    const startPage = Math.max(
      currentPage - Math.floor(maxVisiblePages / 2),
      1
    );
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    const adjustedStartPage = Math.max(endPage - maxVisiblePages + 1, 1);
    const adjustedEndPage = Math.min(
      adjustedStartPage + maxVisiblePages - 1,
      totalPages
    );
    return [...Array(adjustedEndPage - adjustedStartPage + 1).keys()].map(
      (i) => i + adjustedStartPage
    );
  };

  const paginationRange = getPaginationRange();



  // const mutation = useMutation({
  //   mutationFn: async (updatedOrder) => {
  //     const token = localStorage.getItem('authToken');
  //     const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/news-article/order-article`, {
  //       method: 'PUT',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedOrder),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update order');
  //     }

  //     return response.json();
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['all-articles'] });
  //   },
  //   onError: (error) => {
  //     console.error('Error updating order:', error);
  //   },
  // });


  const updateOrder = async (updatedOrder) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/news-article/order-article`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedOrder),
    });

    if (!response.ok) {
      throw new Error('Failed to update order');
    }

    return response.json();
  }





  return (
    <div>
      <div className="flex justify-end items-center m-2  gap-2">
        {/* <div className=" w-full">
          <select
            id="type"
            name="type"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="text-muted-foreground w-full py-2 border-x border-y focus:outline-none"
          >
            <option value="" label="Search By Order..." />
            <option value="asc" label="Old to New " />
            <option value="desc" label="New to Old" />
          </select>
           {formik.errors.type && <div className="text-red-500 text-sm">{formik.errors.type}</div>} 
        </div> */}

        <div className={`w-full max-w-sm ${darkMode ? "dark" : ""}`}>
          <Input
            type="search"
            icons={<SearchIcon width={16} height={16} strokeColor="black" />}
            iconPosition="left"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search Here"
            className="w-full max-w-sm"
          />
        </div>
        <Button className="rounded-none bg-sidebar" onClick={() => handleAdd()}>
          {" "}
          Add New Content{" "}
        </Button>

      </div>
      <div className="border rounded-xs m-2">
        <Table>
          <TableHeader>
            <TableRow>
              {table?.getHeaderGroups()?.map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div

                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                          style: {
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                          },
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <ChevronUpIcon
                              width={12}
                              height={12}
                              style={{ marginLeft: "10px" }}
                            />
                          ),
                          desc: (
                            <ChevronDownIcon
                              width={12}
                              height={12}
                              style={{ marginLeft: "10px" }}
                            />
                          ),
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table?.getRowModel()?.rows?.map((row, index) => (
              <TableRow key={row.id}
              >
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
          <span className="text-sm text-muted-foreground">
            {" "}
            Showing {startEntry} to {endEntry} of {totalEntries} entries{" "}
          </span>
        </div>
        <div className="h-15 p-2 items-center flex justify-center">
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                      className={
                        currentPage === page
                          ? "bg-sidebar text-white rounded-none h-8 w-8"
                          : "bg-white h-8 w-8"
                      }
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        {isModalOpen && (
          <ArticlesModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            articleId={selectedArticle}
            darkMode={darkMode}
          />
        )}

        {alertOpen && (
          <Alert
            open={alertOpen}
            onOpenChange={setAlertOpen}
            title="Delete Article"
            description="Are you sure you want to delete this Article?"
            type="delete"
            onConfirm={deleteVideo}
          />
        )}
      </div>
      <AddArticlesModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}

      />
      {
        isEditModalOpen && (
          <EditArticlesModal
            // data={selectedEditArticle}
            articleId={selectedEditArticle}
            darkMode={darkMode}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />

        )
      }

    </div>
  );
}
