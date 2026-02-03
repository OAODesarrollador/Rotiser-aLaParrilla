'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                // Navegar al dashboard de administración
                router.push('/admin/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Contraseña incorrecta');
                setPassword('');
            }
        } catch (err) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1>🔐 Acceso de Administrador</h1>
                <p className={styles.subtitle}>Gestión de Productos y Base de Datos</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Ingresa la contraseña"
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            disabled={loading}
                            autoFocus
                            className={error ? styles.inputError : ''}
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !password}
                        className={styles.submitBtn}
                    >
                        {loading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>

                <div className={styles.info}>
                    <p>📌 Aquí podrás:</p>
                    <ul>
                        <li>Crear nuevos productos</li>
                        <li>Actualizar precios y descripciones</li>
                        <li>Cambiar disponibilidad</li>
                        <li>Subir imágenes/folletos</li>
                        <li>Eliminar productos obsoletos</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
