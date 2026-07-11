import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImagePlus, PencilLine, Save, Tag, UserRound, X } from 'lucide-react';
import avatar from "../../assets/avatar.jpg";
import { Button } from '../Button/Button';

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: ['serif', 'monospace', 'roboto', 'lobster'] }],
    [{ size: ['small', 'medium', 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    [{ color: ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff'] },
    { background: ['#ffffff', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff'] }],
    ['link'],
    ['clean'],
  ],
};

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
  const directContent =
    article?.description ||
    article?.content ||
    article?.body ||
    article?.details ||
    article?.detail ||
    article?.articleBody ||
    article?.htmlContent ||
    article?.descriptionHtml ||
    '';

  if (directContent) {
    return directContent;
  }

  const seen = new WeakSet();
  const keyPriority = ['description', 'content', 'body', 'details', 'detail', 'html', 'text'];

  function findNestedContent(value) {
    if (!value) return '';

    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedValue.length > 40 || trimmedValue.includes('<p>') || trimmedValue.includes('<div>')) {
        return trimmedValue;
      }
      return '';
    }

    if (typeof value !== 'object') {
      return '';
    }

    if (seen.has(value)) {
      return '';
    }

    seen.add(value);

    for (const key of keyPriority) {
      const match = Object.keys(value).find((objectKey) => objectKey.toLowerCase().includes(key));
      if (match) {
        const nestedResult = findNestedContent(value[match]);
        if (nestedResult) {
          return nestedResult;
        }
      }
    }

    for (const nestedValue of Object.values(value)) {
      const nestedResult = findNestedContent(nestedValue);
      if (nestedResult) {
        return nestedResult;
      }
    }

    return '';
  }

  return findNestedContent(article);
}

export function EditArticlesModal({ isOpen, onClose, data: propsData }) {
  const [image, setImage] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: articleDetail, isLoading } = useQuery({
    queryKey: ['article-detail-edit', propsData?._id],
    enabled: Boolean(isOpen && propsData?._id),
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/news-article/detail/${propsData?._id}`, {
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
    const resolvedArticleData = resolveArticleFromResponse(articleDetail, propsData);
    const mergedArticleData = {
      ...(propsData || {}),
      ...(resolvedArticleData || {}),
    };

    return {
      ...mergedArticleData,
      title: mergedArticleData?.title || mergedArticleData?.name || '',
      author: mergedArticleData?.author || mergedArticleData?.postedBy || mergedArticleData?.createdBy?.email || mergedArticleData?.createdBy?.name || '',
      readTime: mergedArticleData?.readTime || mergedArticleData?.estimatedReadTime || '',
      type: mergedArticleData?.type || mergedArticleData?.category || '',
      order: mergedArticleData?.order ?? 1,
      description: getArticleContent(mergedArticleData),
      media: mergedArticleData?.media || null,
      profilePicture: mergedArticleData?.profilePicture || mergedArticleData?.media?.url || '',
    };
  }, [articleDetail, propsData]);

  const validationSchema = useMemo(() => Yup.object().shape({
    title: Yup.string().required('Title is required'),
    author: Yup.string().required('Author is required'),
    readTime: Yup.number()
      .min(1, 'Minimum read time is 1 minute')
      .max(30, 'Maximum read time is 30 minutes')
      .required('Estimated read time is required'),
    content: Yup.string().required('Content is required'),
    type: Yup.string().required('Type is required'),
  }), []);

  const mutation = useMutation({
    mutationFn: async (newArticle) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/news-article/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: newArticle,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to update article';

        try {
          const errorData = await response.json();
          errorMessage =
            errorData?.error?.details?.MESSAGE ||
            errorData?.error?.details ||
            errorData?.message ||
            errorMessage;
        } catch (_) {
          // Keep fallback text.
        }

        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      setSubmitError('');
      onClose();
    },
    onError: (error) => {
      setSubmitError(error.message || 'Failed to update article');
    },
  });

  const formik = useFormik({
    initialValues: {
      title: articleData?.title || '',
      author: articleData?.author || '',
      readTime: articleData?.readTime || '',
      content: articleData?.description || '',
      image: null,
      type: articleData?.type || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setSubmitError('');
      const date = new Date();
      const formattedDate = date.toISOString();
      const formData = new FormData();

      formData.append('id', articleData?._id);
      formData.append('title', values.title);
      formData.append('readTime', values.readTime);
      formData.append('description', values.content);
      formData.append('content', values.content);
      formData.append('body', values.content);
      formData.append('details', values.content);
      formData.append('publishedTime', formattedDate);
      formData.append('type', String(values.type).toLowerCase());
      formData.append('author', values.author);
      formData.append('order', String(articleData?.order ?? 1));

      if (articleData?.media?._id) {
        formData.append('mediaId', articleData.media._id);
      }

      if (values.image instanceof File) {
        formData.append('mediatype', 'image');
        formData.append('mediaType', 'image');
        formData.append('file', values.image);
      } else if (articleData?.profilePicture) {
        formData.append('mediatype', 'image');
        formData.append('mediaType', 'image');

        if (isValidUrl(articleData.profilePicture)) {
          formData.append('profilePicture', articleData.profilePicture);
          formData.append('existingImage', articleData.profilePicture);
          formData.append('existingMediaUrl', articleData.profilePicture);
        }
      }

      mutation.mutate(formData);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      formik.setFieldValue('image', file);
    };
    reader.readAsDataURL(file);
  };

  const profilePictureUrl = articleData?.profilePicture
    ? isValidUrl(articleData?.profilePicture)
      ? articleData?.profilePicture
      : `${import.meta.env.VITE_APP_API_URL}/uploads/images/${articleData?.profilePicture}`
    : avatar;

  useEffect(() => {
    if (!isOpen) {
      setSubmitError('');
      setImage(null);
    }
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[90vh] w-[min(1180px,96vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[28px] bg-[#fbfaf7] shadow-[0_30px_120px_rgba(15,23,42,0.28)]">
          <div className="flex items-start justify-between border-b border-slate-200 bg-white/80 px-6 py-5 backdrop-blur-sm sm:px-8">
            <div>
              <Dialog.Title className="text-2xl font-semibold text-slate-900">Edit Article</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-slate-500">
                Update the cover, article metadata, and full body content in one place.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {isLoading ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">
                  Loading article details...
                </div>
              ) : (
                <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                  <aside className="space-y-5">
                    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={image || profilePictureUrl}
                          alt={articleData?.title || 'Article cover'}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          <ImagePlus className="h-4 w-4" />
                          Change Cover Image
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Publishing Info</div>
                      <div className="mt-4 space-y-4 text-sm text-slate-600">
                        <div className="flex items-start gap-3">
                          <UserRound className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Author</div>
                            <div className="mt-1 font-medium text-slate-700">{formik.values.author || 'Not set yet'}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Tag className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Order</div>
                            <div className="mt-1 font-medium text-slate-700">{articleData?.order}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>

                  <section className="space-y-5">
                    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-5 flex items-center gap-3">
                        <PencilLine className="h-5 w-5 text-[#1e5eff]" />
                        <h3 className="text-lg font-semibold text-slate-900">Article Basics</h3>
                      </div>

                      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
                          <input
                            type="text"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            placeholder="Add a clear headline..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#1e5eff] focus:bg-white"
                          />
                          {formik.errors.title && <div className="mt-2 text-sm text-red-500">{formik.errors.title}</div>}
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-slate-700">Author</span>
                          <input
                            type="text"
                            name="author"
                            value={formik.values.author}
                            onChange={formik.handleChange}
                            placeholder="Enter author name..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#1e5eff] focus:bg-white"
                          />
                          {formik.errors.author && <div className="mt-2 text-sm text-red-500">{formik.errors.author}</div>}
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-slate-700">Read Time</span>
                          <input
                            type="number"
                            name="readTime"
                            min="1"
                            max="30"
                            value={formik.values.readTime}
                            onChange={formik.handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#1e5eff] focus:bg-white"
                          />
                          {formik.errors.readTime && <div className="mt-2 text-sm text-red-500">{formik.errors.readTime}</div>}
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
                          <select
                            name="type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#1e5eff] focus:bg-white"
                          >
                            <option value="">Select type</option>
                            <option value="general">General</option>
                            <option value="medical">Medical</option>
                          </select>
                          {formik.errors.type && <div className="mt-2 text-sm text-red-500">{formik.errors.type}</div>}
                        </label>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                      <div className="border-b border-slate-200 px-6 py-4">
                        <h3 className="text-lg font-semibold text-slate-900">Article Content</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Write the full article here. This content is what should appear in the details popup.
                        </p>
                      </div>
                      <div className="px-6 py-6">
                        <ReactQuill
                          value={formik.values.content}
                          onChange={(value) => formik.setFieldValue('content', value)}
                          modules={modules}
                          placeholder="Write something meaningful for the article body..."
                          className="min-h-[320px]"
                        />
                        {formik.errors.content && <div className="mt-3 text-sm text-red-500">{formik.errors.content}</div>}
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 bg-white px-6 py-4 sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-red-500">{submitError || ' '}</div>
                <div className="flex items-center gap-3">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <Button
                    type="submit"
                    className="rounded-2xl bg-sidebar px-5 py-3"
                    disabled={mutation.isPending}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {mutation.isPending ? 'Saving...' : 'Save Changes'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
