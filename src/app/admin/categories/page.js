'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './categories.module.css';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) {
        setMessage('No autorizado o error al obtener categorías');
        setCategories([]);
        return;
      }
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      setMessage('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStartEdit = (cat) => {
    setEditing(cat);
    setNewName(cat);
  };

  const handleRename = async () => {
    if (!editing || !newName.trim()) return;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldCategory: editing, newCategory: newName.trim() })
      });
      if (!res.ok) throw new Error('Error al renombrar');
      setMessage('Categoría renombrada');
      setEditing(null);
      await load();
    } catch (err) {
      setMessage(err.message || 'Error');
    }
  };

  const handleDelete = async (cat) => {
    if (!confirm(`Eliminar categoría "${cat}"? Se reasignarán sus productos a 'SIN CATEGORIA'.`)) return;
    try {
      const res = await fetch(`/api/admin/categories?category=${encodeURIComponent(cat)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar categoría');
      setMessage('Categoría eliminada (productos reasignados)');
      await load();
    } catch (err) {
      setMessage(err.message || 'Error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🗂️ Mantenimiento de Categorías</h1>
        <div className={styles.actionsHeader}>
          <button onClick={() => router.push('/admin/dashboard')} className={styles.backBtn}>← Volver</button>
        </div>
      </div>

      {message && (
        <div className={styles.message}>{message} <button onClick={() => setMessage('')} className={styles.close}>✕</button></div>
      )}

      {loading ? (
        <div className={styles.loading}>Cargando categorías...</div>
      ) : (
        <div className={styles.list}>
          {categories.length === 0 ? (
            <div className={styles.empty}>No hay categorías registradas</div>
          ) : (
            categories.map(cat => (
              <div key={cat} className={styles.row}>
                <div className={styles.name}>
                  {editing === cat ? (
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} />
                  ) : (
                    <strong>{cat}</strong>
                  )}
                </div>

                <div className={styles.rowActions}>
                  {editing === cat ? (
                    <>
                      <button onClick={handleRename} className={styles.saveBtn}>Guardar</button>
                      <button onClick={() => setEditing(null)} className={styles.cancelBtn}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleStartEdit(cat)} className={styles.editBtn}>Renombrar</button>
                      <button onClick={() => handleDelete(cat)} className={styles.deleteBtn}>Eliminar</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
