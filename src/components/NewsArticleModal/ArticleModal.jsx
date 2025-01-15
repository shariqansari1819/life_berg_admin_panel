import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';
import { useSelector } from 'react-redux';
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/Card/Card';
import { ArrowUp, ArrowUp01, Award, Book, CalendarClock, CalendarIcon, Flame, MapPinIcon, Target, Upload, X } from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import moment from 'moment';
import avatar from "../../assets/avatar.jpg"
import { Button } from '../Button/Button';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fontSizeArr = ['8px','9px','10px','12px','14px','16px','20px','24px','32px','42px','54px','68px','84px','98px'];

var Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
Quill.register(Size, true);
const modules = {
  toolbar: {
    container: [
      [{ header: '1' }, { header: '2' }, { font: ['serif', 'monospace', 'roboto', 'lobster'] }],
      
        [{ 'size': fontSizeArr }]
      ,
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [
        { color: ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff'] },
        { background: ['#ffffff', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff'] },
      ],
      ['link', 'image'],
      ['clean'], // Clear formatting
    ],
  },
};

const formats = [
  'header',
  'font',
  'size', // Ensure 'size' format is included
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'align',
  'link',
  'color',
  'background',
  'image', // Added 'image' format
];

export function ArticlesModal({ isOpen, onClose, articleId }) {

    const [loading, setLoading] = useState(false);
    const [editorValue, setEditorValue] = useState('');
    const queryClient = useQueryClient();
    const { data, error, isLoading } = useQuery({
        queryKey: ["article details"],
        queryFn: async () => {
          setLoading(true)
          const token = localStorage.getItem("authToken");
          const response = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/news-article/detail/${articleId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response?.status == 401) {
          setLoading(false)

            localStorage.removeItem("authToken");
            navigate(0);
            navigate("/login");
          } else if (response?.status == 400) {
          setLoading(false)

            localStorage.removeItem("authToken");
            navigate(0);
            navigate("/login");
          } else if (response?.status == 500) {
          setLoading(false)

            localStorage.removeItem("authToken");
            navigate(0);
            navigate("/login");
          } else {
            return response.json();
          }
        },
        keepPreviousData: true,
      });


    //   useEffect(()=>{
    //     console.log("useEffect")
    //   },[])

      // console.log("asdsdfsd", data?.data[0])
    


    const handleChange = (content, delta, source, editor) => {
        setEditorValue(content);
        if (onChange) {
            onChange(content);
        }
    };


    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    const { darkMode } = useSelector((state) => state.darkMode);
    // const profilePictureUrl = data?.profilePicture
    //     ? isValidUrl(data?.profilePicture)
    //         ? data?.profilePicture
    //         : `${import.meta.env.VITE_APP_BASE_URL}/uploads/images/${data?.profilePicture}`
    //     : avatar;

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
         
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            {
                loading ? (
            <Dialog.Content className={cn(
                "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md",
                "dark:bg-gray-800 dark:text-muted w-9/12"
            )}>

                <Dialog.Description className="">
                    <Card className="bg-[#f9f9f9] shadow-md rounded-[4px] ">
                        <div className="flex">
                            <div className="w-[200px] bg-white py-5 px-4 space-y-[6px] text-[13px] border-r border-gray-200">
                                <h2 className="font-semibold text-[15px] mb-4">Content Details</h2>
                                <div className="text-[#2d87f3] font-medium">Preview</div>
                                
                            </div>
                            <div className="flex-1 p-5 relative">
                                <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                                    <Dialog.Close asChild>
                                        <button className={cn("rounded-full transition-colors p-1 duration-300 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground", "dark:text-gray-100 dark:bg-gray-900 dark:hover:text-gray-100 dark:hover:bg-gray-400")}>
                                            <X className="h-5 w-5" />
                                        </button>
                                    </Dialog.Close>
                                </button>
                                <div className="flex flex-col w-full items-start h-[500px] overflow-scroll overflow-x-hidden">
                                    <div className="relative w-24 h-24">
                                        <img
                                            src="/"
                                            alt="Uploaded content"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        {/* <div className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer">
                                            <Upload className="w-4 h-4 text-[#75767F]" />
                                        </div> */}
                                    </div>
                                    <div className='flex items-center justify-between w-full py-2'>
                                        <div className=' flex items-center text-[#75767F] text-[16px]'> Posted By: </div>
                                        <div> <span className='text-[#75767F] text-[16px]'>  {data?.data[0]?.author} </span> </div>
                                    </div>

                                    <div className='font-medium text-[#75767F] text-[20px]'>{data?.data[0]?.title}</div>
                                    <div className='flex items-center justify-between w-full py-2'>
                                        <div className=' flex items-center text-[#75767F] text-[16px]'> <span > <CalendarClock className='text-[16px]' /> </span> &nbsp; <span>Upload date:</span> </div>
                                        <div> <span className='text-[#75767F] text-[16px]'> {moment(data?.data[0]?.publishedTime).format('MMM D, YYYY')} </span> </div>
                                    </div>
                                    <div className='flex items-center justify-between w-full'>
                                        <div className=' flex items-center text-[#75767F] text-[16px]'> <span > <Book className='text-[16px]' /> </span> &nbsp; <span>Estimated read time:</span> </div>
                                        <div> <span className='text-[#75767F] text-[16px]'>{data?.data[0]?.readTime} </span> </div>
                                    </div>

                                    <div className='ql-editor' dangerouslySetInnerHTML={{ __html: data?.data[0]?.description }} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </Dialog.Description>
            </Dialog.Content>
              ) : ""}
        </Dialog.Root>
    );
}



