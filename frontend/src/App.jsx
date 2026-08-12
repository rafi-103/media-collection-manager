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
        // ✅ Reverse the order: newest items first
        const sortedItems = [...response.data].reverse();
        setItems(sortedItems);
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

    const getStatusBadge = (status) => {
        const statusMap = {
            'want_to_read': { label: 'Want to Read', color: '#6c5ce7' },
            'currently_reading': { label: 'Currently Reading', color: '#fdcb6e' },
            'completed': { label: 'Completed', color: '#00b894' }
        };
        return statusMap[status] || { label: status, color: '#636e72' };
    };

    const getTypeIcon = (type) => {
        return type === 'book' ? '📖' : '🎬';
    };

    return (
        <>
            <style>
                {`
                    @keyframes gradientBg {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes floatUp {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-6px); }
                        100% { transform: translateY(0px); }
                    }
                    @keyframes glowPulse {
                        0% { box-shadow: 0 0 20px rgba(108, 92, 231, 0.2); }
                        50% { box-shadow: 0 0 40px rgba(108, 92, 231, 0.5); }
                        100% { box-shadow: 0 0 20px rgba(108, 92, 231, 0.2); }
                    }
                    * {
                        box-sizing: border-box;
                    }
                `}
            </style>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(-45deg, #0a0a1a, #1a1a3e, #2d1b4e, #1a1a3e)',
                backgroundSize: '400% 400%',
                animation: 'gradientBg 15s ease infinite',
                padding: '30px 20px',
                fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '32px',
                    padding: '35px 30px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    {/* Header */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            fontSize: '3.8rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #a29bfe, #fd79a8, #a29bfe)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            margin: 0,
                            letterSpacing: '-1px',
                            display: 'inline-block',
                            animation: 'glowPulse 3s ease-in-out infinite'
                        }}>
                           📚 Media Collection Manager
                        </div>
                        <p style={{
                            color: 'rgba(255,255,255,0.35)',
                            fontSize: '1rem',
                            marginTop: '4px',
                            letterSpacing: '3px',
                            fontWeight: '300'
                        }}>
                            YOUR PERSONAL COLLECTION MANAGER
                        </p>
                    </div>

                    {/* Stats Cards with Floating Effect */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '20px',
                        marginBottom: '35px'
                    }}>
                        {[
                            { label: 'Total', value: stats.total, icon: '📊', color: '#a29bfe' },
                            { label: 'Books', value: stats.books, icon: '📖', color: '#74b9ff' },
                            { label: 'Movies', value: stats.movies, icon: '🎬', color: '#fd79a8' },
                            { label: 'Favorites', value: stats.favorites, icon: '⭐', color: '#fdcb6e' }
                        ].map((stat, index) => (
                            <div key={index} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '20px 15px',
                                borderRadius: '20px',
                                textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.06)',
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.4)',
                                backdropFilter: 'blur(5px)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'default',
                                animation: `floatUp ${3 + index * 0.2}s ease-in-out infinite`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 15px 40px -5px rgba(108, 92, 231, 0.3)';
                                e.currentTarget.style.borderColor = 'rgba(108, 92, 231, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.4)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '2px' }}>{stat.icon}</div>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                    color: 'white',
                                    lineHeight: 1.2,
                                    background: `linear-gradient(135deg, ${stat.color}, white)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: '500', letterSpacing: '0.5px', marginTop: '2px' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search & Filters */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        marginBottom: '30px',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '16px 22px',
                        borderRadius: '18px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            placeholder="🔍 Search by title or creator..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '12px 18px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: '0.95rem',
                                outline: 'none',
                                minWidth: '160px',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#a29bfe';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(162, 155, 254, 0.15)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{
                                padding: '12px 18px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: '0.9rem',
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#a29bfe'}
                            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                        >
                            <option value="all" style={{ background: '#1a1a3e' }}>All Types</option>
                            <option value="book" style={{ background: '#1a1a3e' }}>📖 Books</option>
                            <option value="movie" style={{ background: '#1a1a3e' }}>🎬 Movies</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                padding: '12px 18px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: '0.9rem',
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#a29bfe'}
                            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                        >
                            <option value="all" style={{ background: '#1a1a3e' }}>All Statuses</option>
                            <option value="want_to_read" style={{ background: '#1a1a3e' }}>📖 Want to Read</option>
                            <option value="currently_reading" style={{ background: '#1a1a3e' }}>📚 Currently Reading</option>
                            <option value="completed" style={{ background: '#1a1a3e' }}>✅ Completed</option>
                        </select>
                        <button
                            onClick={clearFilters}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                            }}
                        >
                            ✕ Clear All
                        </button>
                    </div>

                    {/* Add/Edit Form */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '24px',
                        padding: '30px',
                        marginBottom: '35px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 10px 40px -15px rgba(0,0,0,0.4)'
                    }}>
                        <h2 style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '1.4rem',
                            fontWeight: '600',
                            margin: '0 0 20px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            {editingId ? '✏️ Edit Item' : '➕ Add New Item'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px'
                            }}>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '500', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#a29bfe'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(162, 155, 254, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }} />
                                </div>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '500', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Type *</label>
                                    <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.95rem', outline: 'none', appearance: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#a29bfe'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                                        <option value="book" style={{ background: '#1a1a3e' }}>📖 Book</option>
                                        <option value="movie" style={{ background: '#1a1a3e' }}>🎬 Movie</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '500', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{formData.type === 'book' ? 'Author' : 'Director'} *</label>
                                    <input type="text" name="creator" value={formData.creator} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#a29bfe'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(162, 155, 254, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }} />
                                </div>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '500', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Genre</label>
                                    <input type="text" name="genre" value={formData.genre} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#a29bfe'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(162, 155, 254, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }} />
                                </div>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '500', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.95rem', outline: 'none', appearance: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#a29bfe'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                                        <option value="want_to_read" style={{ background: '#1a1a3e' }}>📖 Want to Read</option>
                                        <option value="currently_reading" style={{ background: '#1a1a3e' }}>📚 Currently Reading</option>
                                        <option value="completed" style={{ background: '#1a1a3e' }}>✅ Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '500', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Rating (1-5)</label>
                                    <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="1" max="5" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#a29bfe'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(162, 155, 254, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }} />
                                </div>
                                {formData.type === 'movie' && (
                                    <>
                                        <div>
                                            <label style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '500', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Streaming Platform</label>
                                            <input type="text" name="platform" value={formData.platform} onChange={handleChange} placeholder="Netflix, Blu-ray..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#a29bfe'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(162, 155, 254, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '8px' }}>
                                            <label style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                                <input type="checkbox" name="is_favorite" checked={formData.is_favorite} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#fdcb6e', cursor: 'pointer' }} /> ⭐ Mark as Favorite
                                            </label>
                                        </div>
                                    </>
                                )}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '500', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Notes</label>
                                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical', transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#a29bfe'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(162, 155, 254, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '14px', marginTop: '6px' }}>
                                    <button type="submit" disabled={loading} style={{
                                        padding: '14px 42px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #a29bfe, #fd79a8)',
                                        color: 'white',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        boxShadow: '0 8px 30px rgba(162, 155, 254, 0.3)',
                                        letterSpacing: '0.3px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(162, 155, 254, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(162, 155, 254, 0.3)';
                                    }}
                                    >
                                        {loading ? '⏳ Saving...' : (editingId ? '✏️ Update Item' : '➕ Add Item')}
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
                                        }} style={{
                                            padding: '14px 34px',
                                            borderRadius: '14px',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            background: 'transparent',
                                            color: 'rgba(255,255,255,0.5)',
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                        }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Collection Grid */}
                    <div style={{ marginTop: '10px' }}>
                        <h2 style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '1.4rem',
                            fontWeight: '600',
                            margin: '0 0 20px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            📦 Your Collection
                            <span style={{
                                fontSize: '0.8rem',
                                background: 'rgba(255,255,255,0.06)',
                                padding: '2px 16px',
                                borderRadius: '30px',
                                fontWeight: '500',
                                color: 'rgba(255,255,255,0.4)'
                            }}>
                                {items.length} {items.length === 1 ? 'item' : 'items'}
                            </span>
                        </h2>

                        {items.length === 0 ? (
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '24px',
                                padding: '70px 20px',
                                textAlign: 'center',
                                border: '1px dashed rgba(255,255,255,0.05)'
                            }}>
                                <div style={{ fontSize: '4rem', opacity: 0.3 }}>📭</div>
                                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '1.1rem', marginTop: '12px' }}>
                                    Your collection is empty. Start adding your favorite books and movies!
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                                gap: '20px'
                            }}>
                                {items.map((item) => {
                                    const statusInfo = getStatusBadge(item.status);
                                    return (
                                        <div key={item.id} style={{
                                            background: 'rgba(255,255,255,0.04)',
                                            borderRadius: '18px',
                                            padding: '20px',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            boxShadow: '0 10px 30px -15px rgba(0,0,0,0.4)',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                                            cursor: 'default',
                                            backdropFilter: 'blur(5px)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.5)';
                                            e.currentTarget.style.borderColor = 'rgba(162, 155, 254, 0.2)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 30px -15px rgba(0,0,0,0.4)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                        }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                                    <span style={{ fontSize: '1.2rem' }}>{getTypeIcon(item.type)}</span>
                                                    <h3 style={{
                                                        margin: 0,
                                                        fontSize: '1rem',
                                                        color: 'white',
                                                        fontWeight: '600',
                                                        wordBreak: 'break-word',
                                                        flex: 1
                                                    }}>
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                {item.type === 'movie' && item.is_favorite && (
                                                    <span style={{ fontSize: '1.1rem', marginLeft: '6px', flexShrink: 0 }}>⭐</span>
                                                )}
                                            </div>
                                            <p style={{
                                                margin: '6px 0 4px 0',
                                                color: 'rgba(255,255,255,0.65)',
                                                fontSize: '0.9rem',
                                                fontWeight: '500'
                                            }}>
                                                {item.creator}
                                            </p>
                                            <p style={{
                                                margin: '4px 0',
                                                color: 'rgba(255,255,255,0.3)',
                                                fontSize: '0.8rem'
                                            }}>
                                                {item.genre || 'No genre'}
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '10px',
                                                marginTop: '12px'
                                            }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '3px 14px',
                                                    borderRadius: '30px',
                                                    background: statusInfo.color,
                                                    color: 'white',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '600',
                                                    letterSpacing: '0.3px',
                                                    opacity: 0.9,
                                                    boxShadow: `0 4px 15px ${statusInfo.color}30`
                                                }}>
                                                    {statusInfo.label}
                                                </span>
                                                {item.rating && (
                                                    <span style={{
                                                        fontSize: '0.8rem',
                                                        color: 'rgba(255,255,255,0.5)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        ⭐ {item.rating}/5
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{
                                                marginTop: '16px',
                                                display: 'flex',
                                                gap: '10px',
                                                borderTop: '1px solid rgba(255,255,255,0.04)',
                                                paddingTop: '14px'
                                            }}>
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px 12px',
                                                        borderRadius: '10px',
                                                        border: 'none',
                                                        background: 'rgba(255,255,255,0.06)',
                                                        color: 'rgba(255,255,255,0.7)',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                                                        e.currentTarget.style.color = 'white';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                                    }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px 12px',
                                                        borderRadius: '10px',
                                                        border: 'none',
                                                        background: 'rgba(255,107,107,0.08)',
                                                        color: '#ff6b6b',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(255,107,107,0.18)';
                                                        e.currentTarget.style.color = '#ff8787';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(255,107,107,0.08)';
                                                        e.currentTarget.style.color = '#ff6b6b';
                                                    }}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;