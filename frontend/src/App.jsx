import React, { useState, useEffect } from 'react';
import { getAllItems, createItem } from './services/api';

function App() {
    const [items, setItems] = useState([]);
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
    const [loading, setLoading] = useState(false);

    // Fetch items when page loads
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getAllItems();
            setItems(response.data);
        } catch (err) {
            console.error('Failed to fetch items:', err);
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
            await createItem({
                ...formData,
                rating: formData.rating ? parseInt(formData.rating) : null
            });
            // Clear form
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
            // Refresh list
            await fetchItems();
        } catch (err) {
            console.error('Failed to add item:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>📚 Personal Media Collection</h1>

            <h2>Add New Item</h2>
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
                                <input type="checkbox" name="is_favorite" checked={formData.is_favorite} onChange={handleChange} /> ⭐ Favorite
                            </label>
                        </div>
                    </div>
                )}
                <div style={{ marginBottom: '10px' }}>
                    <label>Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" disabled={loading} style={{ background: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px' }}>
                    {loading ? 'Adding...' : 'Add Item'}
                </button>
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
                            <p>✍️ {item.creator}</p>
                            <p>📂 {item.genre || 'No genre'}</p>
                            <p>📌 {item.status}</p>
                            {item.rating && <p>⭐ {item.rating}/5</p>}
                            {item.type === 'movie' && item.is_favorite && <p>⭐ Favorite</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;