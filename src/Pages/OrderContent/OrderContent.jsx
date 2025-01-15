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

function OrderContent() {
  const [articleList, setArticleList] = useState([]);

  const queryClient = useQueryClient();
  const { darkMode } = useSelector((state) => state.darkMode);
  const [globalFilter, setGlobalFilter] = useState("");
  const [draggingIndex, setDraggingIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // State for items per page
  const [deleteObject, setDeleteObject] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
//   const [selectedEditArticle, setSelectedEditArticle] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [order, setOrder] = useState("desc");
  const navigate = useNavigate();
  var totalEntries ;
  var totalPages ;




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
    // console.log("SAdf", row.original?._id)
    setSelectedArticle(row?.original?._id);
    setIsModalOpen(true);
  };











 





  const { data, error, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL
        }/news-article/all-articles`,
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

//   console.log("data", data?.message?.newsArticles)


  useEffect(() => {
    if (data?.message?.newsArticles) {
      const mappedData = data?.message?.newsArticles?.map((article) => ({
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

  


  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

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

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();

    const updatedArticles = [...articleList];
    const [draggedArticle] = updatedArticles.splice(draggingIndex, 1);
    updatedArticles.splice(targetIndex, 0, draggedArticle);

    setArticleList(updatedArticles);
    setDraggingIndex(null);

    updatedArticles.forEach((article, index) => {
      const data = {
        id: article._id,
        order: index,
      };
      updateOrder(data)
    });
  };



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
                // key={row._id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
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
        {isModalOpen && (
          <ArticlesModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            articleId={selectedArticle}
            darkMode={darkMode}
          />
        )}
      </div>     
    </div>
  );
}



export default OrderContent
