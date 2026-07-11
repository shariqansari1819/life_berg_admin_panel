import * as Dialog from '@radix-ui/react-dialog';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  CalendarClock,
  FileText,
  ImageIcon,
  UserRound,
  X,
} from 'lucide-react';
import moment from 'moment';
import avatar from "../../assets/avatar.jpg";

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

export function ArticlesModal({ isOpen, onClose, data }) {
  const { data: articleDetail, isLoading } = useQuery({
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
    const resolvedArticle = resolveArticleFromResponse(articleDetail, data);
    const mergedArticle = resolvedArticle ? { ...data, ...resolvedArticle } : data;

    return {
      ...mergedArticle,
      title: mergedArticle?.title || mergedArticle?.name || 'Untitled article',
      readTime: mergedArticle?.readTime || mergedArticle?.estimatedReadTime || 'N/A',
      publishedTime: mergedArticle?.publishedTime || mergedArticle?.createdAt || '',
      author: mergedArticle?.author || mergedArticle?.postedBy || mergedArticle?.createdBy?.email || mergedArticle?.createdBy?.name || 'Admin',
      description: getArticleContent(mergedArticle),
      profilePicture: mergedArticle?.profilePicture || mergedArticle?.media?.url || '',
      type: mergedArticle?.type || mergedArticle?.category || 'General',
    };
  }, [articleDetail, data]);

  const profilePictureUrl = articleData?.profilePicture
    ? isValidUrl(articleData?.profilePicture)
      ? articleData?.profilePicture
      : `${import.meta.env.VITE_APP_API_URL}/uploads/images/${articleData?.profilePicture}`
    : avatar;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[88vh] w-[min(1120px,94vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-[#f7f4ee] shadow-[0_30px_120px_rgba(15,23,42,0.28)]">
          <div className="hidden w-[280px] shrink-0 flex-col justify-between bg-sidebar p-8 text-white lg:flex">
            <div>
              <Dialog.Title className="text-[30px] font-semibold leading-tight">Content Details</Dialog.Title>
              <p className="mt-3 text-sm leading-6 text-white/78">
                Review the article content, metadata, and cover image in a cleaner reading layout.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.22em] text-white/65">Category</div>
                <div className="mt-2 text-lg font-medium capitalize">{articleData?.type}</div>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col bg-[#fcfbf8]">
            <div className="flex items-start justify-between border-b border-slate-200/80 px-6 py-5 sm:px-8">
              <div className="min-w-0">
                <Dialog.Title className="text-2xl font-semibold text-slate-900">Article Preview</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-500">
                  Full content view with metadata and cover image.
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

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {isLoading ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">
                  Loading article details...
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={profilePictureUrl}
                          alt={articleData?.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="inline-flex items-center rounded-full bg-[#e7f1ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1e5eff]">
                          {articleData?.type}
                        </div>
                        <div className="space-y-3 text-sm text-slate-600">
                          <div className="flex items-start gap-3">
                            <UserRound className="mt-0.5 h-4 w-4 text-slate-400" />
                            <div>
                              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Author</div>
                              <div className="mt-1 font-medium text-slate-700">{articleData?.author}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CalendarClock className="mt-0.5 h-4 w-4 text-slate-400" />
                            <div>
                              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Published</div>
                              <div className="mt-1 font-medium text-slate-700">
                                {articleData?.publishedTime ? moment(articleData.publishedTime).format('MMM D, YYYY') : 'N/A'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <BookOpen className="mt-0.5 h-4 w-4 text-slate-400" />
                            <div>
                              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Read Time</div>
                              <div className="mt-1 font-medium text-slate-700">{articleData?.readTime} min</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <ImageIcon className="mt-0.5 h-4 w-4 text-slate-400" />
                            <div>
                              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Cover</div>
                              <div className="mt-1 font-medium text-slate-700">Primary article image</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Headline</div>
                        <h2 className="mt-3 text-[17px] font-semibold leading-7 text-slate-900">
                          {articleData?.title}
                        </h2>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-[#1e5eff]" />
                            <h3 className="text-lg font-semibold text-slate-900">Article Body</h3>
                          </div>
                        </div>
                        <div className="px-6 py-6">
                          {articleData?.description ? (
                            articleData.description.includes('<') ? (
                              <div
                                className="ql-editor min-h-[280px] max-w-none px-0 py-0 text-[16px] leading-8 text-slate-700"
                                dangerouslySetInnerHTML={{ __html: articleData.description }}
                              />
                            ) : (
                              <div className="min-h-[280px] whitespace-pre-wrap text-[16px] leading-8 text-slate-700">
                                {articleData.description}
                              </div>
                            )
                          ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
                              No content available for this article yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
