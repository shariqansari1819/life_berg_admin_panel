import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import React, { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Trash2Icon, Pen } from 'lucide-react';
import Alert from '../../components/Alert/Alert';
import { Modal } from '../../components/Modal/Modal';
import Banner from '../Banner/Banner';
import ViewBanner from '../../components/ViewBanner/ViewBanner';

const Banners = () => {
    const queryClient = useQueryClient();
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleteObject, setDeleteObject] = useState(null);
    const [updateObject, setUpdateObject] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);


    // UseQuery must always run in the same order
    const { data, error, isLoading } = useQuery({
        queryKey: ['banners'],
        queryFn: async () => {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/banner/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        keepPreviousData: true,
    });

    // Ensure this is outside of any condition to prevent hook re-ordering
    const deleteBannerMutation = useMutation({
        mutationFn: async (bannerId) => {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/banner/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id: bannerId }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error deleting banner');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['banners']);
            setAlertOpen(false);
        },
        onError: (error) => {
            console.error('Error deleting banner:', error.message);
        },
    });

    const handleDelete = (data) => {
        setDeleteObject(data);
        setAlertOpen(true);
    };

    const handleUpdate = (data) => {
        setUpdateObject(data);
        setIsUpdateModalOpen(true)
    };

    const deleteBanner = () => {
        if (deleteObject) {
            deleteBannerMutation.mutate(deleteObject);
        }
    };

    if (isLoading) return <div className="text-center">Loading...</div>;
    if (error) return <div>Error loading banners: {error.message}</div>;

    const handleAdd = () => {
        // console.log("row for view", row.original)
        // setSelectedArticle(row?.original)
        setIsAddModalOpen(true);
    };

    return (
        <div className="flex justify-center items-center m-2 flex-col">
            <Button className="rounded-md bg-sidebar my-2" onClick={() => handleAdd()}> Add New Content </Button>
            {
                data?.data?.map((banner) => (
                    <div key={banner?._id} className="bg-background rounded-lg border p-6 w-full max-w-full">
                        <div className="flex justify-between items-center">
                            <div>
                                <div>{banner?.title}</div>
                                <div>{moment(banner?.startDate).format("MMM Do YY")}</div>
                                <div>{moment(banner?.endDate).format("MMM Do YY")}</div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" className="text-red-500" size="icon" onClick={() => handleDelete(banner?._id)}>
                                    <Trash2Icon className="h-4 w-4" />
                                    <span className="sr-only">delete</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleUpdate(banner)}>
                                    <Pen className="h-4 w-4" />
                                    <span className="sr-only">update</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))
            }
            {
                alertOpen &&
                <Alert
                    open={alertOpen}
                    onOpenChange={setAlertOpen}
                    title="Delete Item"
                    description="Are you sure you want to delete this item?"
                    type="fail"
                    onConfirm={deleteBanner}
                />
            }
            {
                isAddModalOpen &&
                <Modal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    content={<Banner onClose={() => setIsAddModalOpen(false)} />}
                />
            }
            {
                isUpdateModalOpen &&
                <Modal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    content={<ViewBanner data={updateObject} onClose={() => setIsUpdateModalOpen(false)} />}
                />
            }
        </div>
    );
};

export default Banners;
