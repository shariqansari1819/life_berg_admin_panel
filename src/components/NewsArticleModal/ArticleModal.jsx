import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';
import { useSelector } from 'react-redux';
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/Card/Card';
import { ArrowUp, ArrowUp01, Award, Book, CalendarClock, CalendarIcon, Flame, MapPinIcon, Target, Upload, X } from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import moment from 'moment';
import avatar from "../../assets/avatar.jpg"
import { Button } from '../Button/Button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { font: ['serif', 'monospace', 'roboto', 'lobster'] }],
        [{ size: ['small', 'medium', 'large', 'huge']}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff'] }, 
        { 'background': ['#ffffff', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff'] }],
        ['link'],
        ['clean'] // Clear formatting
    ]
  };
  
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', // Ensure these are included
    'indent',
    'align', 'link',
    'color', 'background',
];

export function ArticlesModal({ isOpen, onClose, data }) {
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function resolveArticleFromResponse(responseData, fallbackData) {
        const candidates = [
            responseData?.message?.newsArticle,
            responseData?.message?.article,
            responseData?.message?.data,
            responseData?.message?.doc,
            responseData?.data?.newsArticle,
            responseData?.data?.article,
            responseData?.data?.doc,
            responseData?.data,
            responseData?.message,
            fallbackData,
        ];

        return candidates.find((candidate) => candidate && typeof candidate === 'object') || fallbackData;
    }

    function getArticleContent(article) {
        return article?.description || article?.content || article?.body || article?.details || '';
    }

    const { darkMode } = useSelector((state) => state.darkMode);
    const { data: articleDetail } = useQuery({
        queryKey: ['article-detail', data?._id],
        enabled: Boolean(isOpen && data?._id),
        queryFn: async () => {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/news-article/detail/${data?._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load article details');
            }

            return response.json();
        },
    });

    const articleData = useMemo(() => {
        const detailedArticle = resolveArticleFromResponse(articleDetail, data);
        const mergedArticle = detailedArticle ? { ...data, ...detailedArticle } : data;

        return {
            ...mergedArticle,
            title: mergedArticle?.title || mergedArticle?.name || '',
            readTime: mergedArticle?.readTime || mergedArticle?.estimatedReadTime || '',
            publishedTime: mergedArticle?.publishedTime || mergedArticle?.createdAt || '',
            author: mergedArticle?.author || mergedArticle?.postedBy || mergedArticle?.createdBy?.email || mergedArticle?.createdBy?.name || 'Admin',
            description: getArticleContent(mergedArticle),
            profilePicture: mergedArticle?.profilePicture || mergedArticle?.media?.url || '',
        };
    }, [articleDetail, data]);

    const profilePictureUrl = articleData?.profilePicture
        ? isValidUrl(articleData?.profilePicture)
            ? articleData?.profilePicture
            : `${import.meta.env.VITE_APP_API_URL}/uploads/images/${articleData?.profilePicture}`
        : avatar;

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
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
                                {/* <div className="text-gray-600">Membership Status</div>
                                <div className="text-gray-600">Payment History</div> */}
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
                                            src={profilePictureUrl}
                                            alt="Uploaded content"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <div className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer">
                                            <Upload className="w-4 h-4 text-[#75767F]" />
                                        </div>
                                    </div>
                                    <div className='font-normal text-[#75767F] mt-2 text-[16px]'> Posted By: {articleData?.author} </div>
                                    <div className='font-medium text-[#75767F] text-[20px]'>{articleData?.title}</div>
                                    <div className='flex items-center justify-between w-full py-2'>
                                        <div className=' flex items-center text-[#75767F] text-[16px]'> <span > <CalendarClock className='text-[16px]' /> </span> &nbsp; <span>Upload date:</span> </div>
                                        <div> <span className='text-[#75767F] text-[16px]'> {moment(articleData?.publishedTime).format('MMM D, YYYY')} </span> </div>
                                    </div>
                                    <div className='flex items-center justify-between w-full'>
                                        <div className=' flex items-center text-[#75767F] text-[16px]'> <span > <Book className='text-[16px]' /> </span> &nbsp; <span>Estimated read time:</span> </div>
                                        <div> <span className='text-[#75767F] text-[16px]'>{articleData?.readTime} </span> </div>
                                    </div>

                                    {
                                        articleData?.description?.includes('<')
                                            ? <div className='w-full ql-editor' dangerouslySetInnerHTML={{ __html: articleData.description }} />
                                            : <div className='w-full whitespace-pre-wrap text-[#75767F] text-[16px] leading-7 py-4'>{articleData?.description || 'No content available.'}</div>
                                    }

                                    {/* <div className='flex gap-28'>
                                        <div>
                                            <div className="w-full h-[2px] bg-blue-100 my-2 "></div>
                                            <div> <span className='text-[#75767F] text-[16px]'>Attachments</span> </div>
                                            <div className='leading-none'> <span className='font-medium text-[#75767F] text-[20px]'> Upload a photo, document or video here </span> </div>
                                            <div className='flex gap-2'>
                                                <div className="relative w-36 h-36">
                                                    <img
                                                        src={avatar}
                                                        alt="Uploaded content"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <div className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer">
                                                        <Upload className="w-4 h-4 text-[#75767F]" />
                                                    </div>
                                                </div>
                                                <div className="relative w-36 h-36">
                                                    <img
                                                        src={avatar}
                                                        alt="Uploaded content"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <div className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer">
                                                        <Upload className="w-4 h-4 text-[#75767F]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="w-full h-[2px] bg-blue-100 my-2 "></div>
                                            <div> <span className='text-[#75767F] text-[16px]'>Tags :</span> </div>
                                            <div> <span className='font-medium text-[#75767F] text-[20px]'> Choose a few tags that describes the content</span> </div>
                                            <div className='flex gap-2 flex-wrap'>
                                                <Button className="rounded-none border-slate-400 border bg-white">
                                                    <span className='text-[#75767F]'>
                                                        Nature
                                                    </span>
                                                </Button>
                                                <Button className="rounded-none border-slate-400 border bg-white">
                                                    <span className='text-[#75767F]'>
                                                        Nature
                                                    </span>
                                                </Button>
                                                <Button className="rounded-none border-slate-400 border bg-white">
                                                    <span className='text-[#75767F]'>
                                                        Nature
                                                    </span>
                                                </Button>
                                                <Button className="rounded-none border-slate-400 border bg-white">
                                                    <span className='text-[#75767F]'>
                                                        Nature
                                                    </span>
                                                </Button>
                                                <Button className="rounded-none border-slate-400 border bg-white">
                                                    <span className='text-[#75767F]'>
                                                        Nature
                                                    </span>
                                                </Button> <Button className="rounded-none border-slate-400 border bg-white">
                                                    <span className='text-[#75767F]'>
                                                        Nature
                                                    </span>
                                                </Button>

                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                {/* <div className="w-full h-[2px] bg-blue-100 my-2 "></div> */}

                                {/* <div className='flex items-center justify-between w-full'>
                                    <div className=' flex items-center text-[#75767F] text-[16px]'><span>Details:</span> </div>
                                </div> */}

                                {/* <div className="text-editor">
                                    <ReactQuill
                                        value={data?.description}

                                        modules={modules}
                                        formats={formats}
                                        placeholder="Write something awesome..."
                                    />
                                </div> */}

                                {/* <div className="space-y-[10px] text-[13px]">
                                    <div className="flex items-center">
                                        <CalendarIcon className="w-[18px] h-[18px] mr-3 text-gray-400" />
                                        <div className='flex items-center justify-between w-full'>
                                            <div className="text-gray-500">Date Joined:</div>
                                            <div className="mt-[2px]">{moment(data?.createdAt).format('MMM D, YYYY')}</div>
                                        </div>
                                    </div>
                                    {
                                        data?.dob && <div className="flex items-center">
                                            <CalendarIcon className="w-[18px] h-[18px] mr-3 text-gray-400" />
                                            <div className='flex items-center justify-between w-full'>
                                                <div className="text-gray-500">Date of Birth:</div>
                                                <div className="mt-[2px]">{moment(data?.dob).format('MM/DD/YYYY')}</div>
                                            </div>
                                        </div>

                                    }

                                    {
                                        data?.country && <div className="flex items-center">
                                            <MapPinIcon className="w-[18px] h-[18px] mr-3 text-gray-400" />
                                            <div className='flex items-center justify-between w-full'>
                                                <div className="text-gray-500">Location:</div>
                                                <div className="mt-[2px]">{data?.country}</div>
                                            </div>
                                        </div>


                                    }


                                    <div className="w-full h-[2px] bg-blue-100 my-5 "></div>
                                    <div className="flex items-center">
                                        <Flame className="w-[18px] h-[18px] mr-3 text-gray-400" />
                                        <div className='flex items-center justify-between w-full'>
                                            <div className="text-gray-500">Streak:</div>
                                            <div className="mt-[2px]">{data?.currentStreak}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Target className="w-[18px] h-[18px] mr-3 text-gray-400" />
                                        <div className='flex items-center justify-between w-full'>
                                            <div className="text-gray-500">Number of goals achieved:</div>
                                            <div className="mt-[2px]">52</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Award className="w-[18px] h-[18px] mr-3 text-gray-400" />
                                        <div className='flex items-center justify-between w-full'>
                                            <div className="text-gray-500">Total App points:</div>
                                            <div className="mt-[2px]">192</div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </Card>
                </Dialog.Description>
            </Dialog.Content>
        </Dialog.Root>
    );
}
