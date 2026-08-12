import React, { useState, useEffect } from 'react';
import { getAllItems, createItem, updateItem, deleteItem, searchItems, filterByType, filterByStatus, getStats } from './services/api';

function App() {
    const [items, setItems] = useState([]);
    const [stats, setStats] = useState({ total: 0, books: 0, movies: 0, favorites: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'book',
        creator: '',
        genre: '',
        status: 'want_to_read',
        rating: '',
        platform: '',
        is_favorite: false,
        notes: ''
    });

    useEffect(() => {
        fetchItems();
        fetchStats();
    }, [searchTerm, filterType, filterStatus]);

    const fetchItems = async () => {
        try {
            let response;
            if (searchTerm) {
                response = await searchItems(searchTerm);
            } else if (filterType !== 'all') {
                response = await filterByType(filterType);
            } else if (filterStatus !== 'all') {
                response = await filterByStatus(filterStatus);
            } else {
                response = await getAllItems();
            }
            setItems(response.data);
        } catch (err) {
            console.error('Failed to fetch items:', err);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getStats();
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateItem(editingId, {
                    ...formData,
                    rating: formData.rating ? parseInt(formData.rating) : null
                });
                setEditingId(null);
            } else {
                await createItem({
                    ...formData,
                    rating: formData.rating ? parseInt(formData.rating) : null
                });
            }
            setFormData({
                title: '',
                type: 'book',
                creator: '',
                genre: '',
                status: 'want_to_read',
                rating: '',
                platform: '',
                is_favorite: false,
                notes: ''
            });
            await fetchItems();
            await fetchStats();
        } catch (err) {
            console.error('Failed to save item:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            type: item.type,
            creator: item.creator,
            genre: item.genre || '',
            status: item.status,
            rating: item.rating || '',
            platform: item.platform || '',
            is_favorite: item.is_favorite || false,
            notes: item.notes || ''
        });
        setEditingId(item.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteItem(id);
                await fetchItems();
                await fetchStats();
            } catch (err) {
                console.error('Failed to delete item:', err);
            }
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('all');
        setFilterStatus('all');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>Personal Media Collection</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', background: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
                <span>Total: {stats.total}</span>
                <span>Books: {stats.books}</span>
                <span>Movies: {stats.movies}</span>
                <span>Favorites: {stats.favorites}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search by title or creator..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: '8px', minWidth: '150px' }}
                />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: '8px' }}>
                    <option value="all">All Types</option>
                    <option value="book">Books</option>
                    <option value="movie">Movies</option>
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '8px' }}>
                    <option value="all">All Statuses</option>
                    <option value="want_to_read">Want to Read / Watchlist</option>
                    <option value="currently_reading">Currently Reading / Watching</option>
                    <option value="completed">Completed</option>
                </select>
                <button onClick={clearFilters} style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Clear Filters
                </button>
            </div>

            <h2>{editingId ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Type *</label>
                    <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        <option value="book">Book</option>
                        <option value="movie">Movie</option>
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>{formData.type === 'book' ? 'Author' : 'Director'} *</label>
                    <input type="text" name="creator" value={formData.creator} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Genre</label>
                    <input type="text" name="genre" value={formData.genre} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        <option value="want_to_read">Want to Read / Watchlist</option>
                        <option value="currently_reading">Currently Reading / Watching</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Rating (1-5)</label>
                    <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="1" max="5" style={{ width: '100%', padding: '8px' }} />
                </div>
                {formData.type === 'movie' && (
                    <div style={{ marginBottom: '10px' }}>
                        <label>Streaming Platform</label>
                        <input type="text" name="platform" value={formData.platform} onChange={handleChange} placeholder="Netflix, Blu-ray, etc." style={{ width: '100%', padding: '8px' }} />
                        <div>
                            <label>
                                <input type="checkbox" name="is_favorite" checked={formData.is_favorite} onChange={handleChange} /> Favorite
                            </label>
                        </div>
                    </div>
                )}
                <div style={{ marginBottom: '10px' }}>
                    <label>Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={loading} style={{ background: editingId ? '#ffc107' : '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {loading ? 'Saving...' : (editingId ? 'Update Item' : 'Add Item')}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => {
                            setEditingId(null);
                            setFormData({
                                title: '',
                                type: 'book',
                                creator: '',
                                genre: '',
                                status: 'want_to_read',
                                rating: '',
                                platform: '',
                                is_favorite: false,
                                notes: ''
                            });
                        }} style={{ background: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <hr style={{ margin: '30px 0' }} />

            <h2>Your Collection ({items.length})</h2>
            {items.length === 0 ? (
                <p>No items yet. Add your first book or movie above!</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                    {items.map((item) => (
                        <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                            <h3>{item.title}</h3>
                            <p>{item.creator}</p>
                            <p>{item.genre || 'No genre'}</p>
                            <p>{item.status}</p>
                            {item.rating && <p>Rating: {item.rating}/5</p>}
                            {item.type === 'movie' && item.is_favorite && <p>Favorite</p>}
                            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={() => handleEdit(item)}
                                    style={{ background: '#ffc107', color: '#000', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(item.id)}
                                    style={{ background: '#dc3545', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;