import * as Dialog from '@radix-ui/react-dialog';
import { useSelector } from 'react-redux';
import { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import avatar from "../../assets/avatar.jpg";
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { X, Upload, Book } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { cn } from '../../lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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


// // Fetch subcategories API function
// const fetchSubCategories = async () => {
//   const token = localStorage.getItem('authToken');
//   const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/article-subcategory/all`, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json();
// };

export function AddArticlesModal({ isOpen, onClose, nextOrder = 1 }) {
  const [image, setImage] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const articleAuthor = localStorage.getItem('email') || 'Admin';

  // Fetch subcategories using tanStack Query
  // const { data: subCategories = [], error: subCategoriesError, isLoading: isSubCategoriesLoading } = useQuery({
  //   queryKey: ['subCategories'],
  //   queryFn: fetchSubCategories,
  // });


  // console.log("subCategories", subCategories)

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    readTime: Yup.number()
      .min(1, 'Minimum read time is 1 minute')
      .max(5, 'Maximum read time is 5 minutes')
      .required('Estimated read time is required'),
    content: Yup.string().required('Content is required'),
    image: Yup.mixed().required('Image is required'),
    type: Yup.string().required('Type is required'),
    // subCategory: Yup.string().required('SubCategory is required'),
  });

  const mutation = useMutation({
    mutationFn: async (newArticle) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/news-article/create` , {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: newArticle,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create article';

        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorData?.error?.details?.MESSAGE || errorMessage;
        } catch (_) {
          // Keep the fallback message when the API does not return JSON.
        }

        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      setSubmitError('');
      formik.resetForm();
      setImage(null);
      onClose();
    },
    onError: (error) => {
      setSubmitError(error.message || 'Failed to create article');
      console.error('Error creating article:', error);
    },
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      readTime: '',
      content: '',
      image: null,
      type: '', // New field
      // subCategory: '', // New field
    },
    validationSchema,
    onSubmit: (values) => {
      setSubmitError('');
      const date = new Date();
      const formattedDate = date.toISOString();

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('readTime', values.readTime);
      formData.append('description', values.content);
      formData.append('file', values.image);
      formData.append('mediatype', 'image');
      formData.append('mediaType', 'image');
      formData.append('publishedTime', formattedDate);
      formData.append('type', values.type); // New field
      formData.append('author', articleAuthor);
      formData.append('order', String(nextOrder));
      // formData.append('subCategory', values.subCategory); // New field

      mutation.mutate(formData);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        formik.setFieldValue('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const { darkMode } = useSelector((state) => state.darkMode);
  const profilePictureUrl = avatar;

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
      <Dialog.Content className={cn(
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md",
        "dark:bg-gray-800 dark:text-muted w-9/12"
      )}>
        <Dialog.Description>
          <form onSubmit={formik.handleSubmit}>
            <Card className="bg-[#f9f9f9] shadow-md rounded-[4px] overflow-hidden">
              <div className="flex h-full">
                <div className="w-[200px] bg-white py-5 px-4 space-y-[6px] text-[13px] border-r border-gray-200">
                  <h2 className="font-semibold text-[15px] mb-4">Create New Article</h2>
                  <div className="text-[#2d87f3] font-medium">Basic Information</div>
                  {/* <div className="text-gray-600">Attachments & Details</div>
                  <div className="text-gray-600">Preview</div> */}
                </div>
                <div className="flex-1 p-5 relative">
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <Dialog.Close asChild>
                      <button className={cn("rounded-full transition-colors p-1 duration-300 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground", "dark:text-gray-100 dark:bg-gray-900 dark:hover:text-gray-100 dark:hover:bg-gray-400")}>
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                  </button>
                  <div className="flex flex-col items-start h-[500px] overflow-scroll overflow-x-hidden">
                    <div className="relative w-24 h-24">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                      <img
                        src={image ? image : profilePictureUrl}
                        alt="Uploaded content"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer">
                        <Upload className="w-4 h-4 text-[#75767F]" onClick={handleUploadClick} />
                      </div>
                    </div>
                      {formik.errors.image && <div className="text-red-500 text-sm">{formik.errors.image}</div>}
                    <div className='font-normal text-[#75767F] mt-2 text-[16px]'> Posted By: Admin </div>
                    <div className='font-medium text-[#75767F] text-[20px]'>
                      <Input
                        type="text"
                        name="title"
                        className="border-none"
                        placeholder="Add a title here..."
                        onChange={formik.handleChange}
                        value={formik.values.title}
                      />
                      {formik.errors.title && <div className="text-red-500 text-sm">{formik.errors.title}</div>}
                    </div>
                    <div className='flex items-center justify-between w-full'>
                      <div className=' flex items-center text-[#75767F] text-[16px]'>
                        <Book className='text-[16px]' /> &nbsp; <span>Estimated read time:</span>
                      </div>
                      <div className='flex items-center'>
                        <Input
                          type="number"
                          name="readTime"
                          min="1"
                          max="5"
                          onChange={formik.handleChange}
                          value={formik.values.readTime}
                          className="h-8"
                        />
                        &nbsp; <span> min </span>
                      </div>
                    </div>
                      {formik.errors.readTime && <div className="text-red-500 text-sm">{formik.errors.readTime}</div>}
                    <div className="w-full h-[2px] bg-blue-100 my-2 "></div>
                    <div className='flex items-center justify-between w-full'>
                      <div className=' flex items-center text-[#75767F] text-[16px]'><span>Details:</span></div>
                    </div>
                    <div className="text-editor w-full h-54">
                      <ReactQuill
                        value={formik.values.content}
                        onChange={value => formik.setFieldValue('content', value)}
                        modules={modules}
                        formats={formats}
                        placeholder="Write something awesome..."

                        // style={{
                        //   "minHeight": "200px", /* Ensure there's enough height */
                        //   "maxHeight": "500px", /* Optional: restrict the max height */
                        //   "overflowY": "auto"  /* Allow scrolling for long content */
                        // }}
                        
                      />
                      {formik.errors.content && <div className="text-red-500 text-sm">{formik.errors.content}</div>}
                    </div>

                    {/* New Fields */}
                    <div className="mt-4 w-full">
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        onChange={formik.handleChange}
                        value={formik.values.type}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="" label="Select type" />
                        <option value="general" label="General" />
                        <option value="medical" label="Medical" />
                      </select>
                      {formik.errors.type && <div className="text-red-500 text-sm">{formik.errors.type}</div>}
                    </div>

                    {/* <div className="mt-4 w-full">
                      <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        SubCategory
                      </label>
                      <select
                        id="subCategory"
                        name="subCategory"
                        onChange={formik.handleChange}
                        value={formik.values.subCategory}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="" label="Select subcategory" />
                        {isSubCategoriesLoading ? (
                          <option>Loading...</option>
                        ) : subCategoriesError ? (
                          <option>Error loading subcategories</option>
                        ) : (
                          subCategories?.data?.map((subcategory) => (
                            <option key={subcategory._id} value={subcategory._id}>
                              {subcategory.name}
                            </option>
                          ))
                        )}
                      </select>
                      {formik.errors.subCategory && <div className="text-red-500 text-sm">{formik.errors.subCategory}</div>}
                    </div> */}

                    <Button type="submit" className="mt-4" disabled={mutation.isPending}>
                      {mutation.isPending ? 'Submitting...' : 'Submit'}
                    </Button>
                    {submitError && <div className="text-red-500 text-sm">Error: {submitError}</div>}
                  </div>
                </div>
              </div>
            </Card>
          </form>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}
