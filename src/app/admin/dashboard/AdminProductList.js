'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductEditor from '@/components/business/ProductEditor';
import styles from './AdminProductList.module.css';

export default function AdminProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    // Cargar productos
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data.data || []);
            } else {
                setMessage('Error al cargar productos');
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar producto
    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/products?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMessage('Producto eliminado');
                fetchProducts();
            } else {
                setMessage('Error al eliminar producto');
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    // Logout
    const handleLogout = () => {
        router.push('/admin');
        router.refresh();
    };

    // Filtrar productos
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || p.categoria === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Obtener categorías únicas
    const categories = [...new Set(products.map(p => p.categoria))].sort();

    if (loading && products.length === 0) {
        return <div className={styles.loading}>Cargando productos...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>📦 Gestión de Productos</h1>
                    <p className={styles.subtitle}>Administra precios, descripciones, imágenes y disponibilidad</p>
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button onClick={() => router.push('/admin/categories')} className={styles.categoriesBtn} title="Gestionar Categorías">
                        🗂️ Categorías
                    </button>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        🚪 Salir
                    </button>
                </div>
            </div>

            {message && (
                <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.success}`}>
                    {message}
                    <button onClick={() => setMessage('')} className={styles.closeBtn}>✕</button>
                </div>
            )}

            {showForm && !editingId ? (
                <ProductEditor
                    onSave={() => {
                        setShowForm(false);
                        fetchProducts();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            ) : null}

            {editingId ? (
                <ProductEditor
                    product={products.find(p => p.id === editingId)}
                    onSave={() => {
                        setEditingId(null);
                        fetchProducts();
                    }}
                    onCancel={() => setEditingId(null)}
                />
            ) : (
                <>
                    <div className={styles.toolbar}>
                        <button
                            className={styles.createBtn}
                            onClick={() => setShowForm(!showForm)}
                        >
                            + Crear Nuevo Producto
                        </button>

                        <div className={styles.filters}>
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />

                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Disponible</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td className={styles.nameCell}>
                                                {product.nombre}
                                                {product.descripcion && (
                                                    <small>{product.descripcion.substring(0, 50)}...</small>
                                                )}
                                            </td>
                                            <td>{product.categoria}</td>
                                            <td>${product.precio}</td>
                                            <td>
                                                <span className={product.disponible ? styles.available : styles.unavailable}>
                                                    {product.disponible ? 'Sí' : 'No'}
                                                </span>
                                            </td>
                                            <td className={styles.actions}>
                                                <button
                                                    onClick={() => setEditingId(product.id)}
                                                    className={styles.editBtn}
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className={styles.deleteBtn}
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className={styles.noResults}>
                                            No se encontraron productos
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.summary}>
                        Total: {filteredProducts.length} productos
                    </div>
                </>
            )}
        </div>
    );
}
