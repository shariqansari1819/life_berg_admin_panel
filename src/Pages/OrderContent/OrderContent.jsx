import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function App() {
    const [articleList, setArticleList] = useState([]);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['all-articles'], // Ensure this uses object syntax
        queryFn: async () => {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/news-article/all-articles`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if ([401, 400, 500].includes(response?.status)) {
                localStorage.removeItem('authToken');
                navigate('/login');
                throw new Error('Authentication error');
            }

            return response.json();
        },
    });

    useEffect(() => {
        if (data?.message?.newsArticles) {
            setArticleList(data.message.newsArticles);
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: async (updatedOrder) => {
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
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-articles'] }); // Correct usage
        },
        onError: (error) => {
            console.error('Error updating order:', error);
        },
    });

    const handleDragStart = (index) => {
        setDraggingIndex(index);
    };

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
        
            mutation.mutate(data); // Perform mutation for each article
        });
        // console.log("updatedOrder", updatedOrder)
        // mutation.mutate(updatedOrder);
    };

    return (
        <div className="App">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}

            <ul style={{ width: '100%', margin: '0 auto', padding: '0', listStyleType: 'none' }}>
                {articleList.map((article, index) => (
                    <li
                        key={article._id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, index)}
                        style={{
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: draggingIndex === index ? '#d3d3d3' : '#f0f0f0',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            boxShadow: draggingIndex === index ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            cursor: 'move',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {article.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
