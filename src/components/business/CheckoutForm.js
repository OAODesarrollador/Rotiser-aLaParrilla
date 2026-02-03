'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { generateWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/utils';
import styles from './CheckoutForm.module.css';

export default function CheckoutForm({ whatsappNumber }) {
    const { items, total, clearCart } = useCart();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        method: 'retiro',
        address: '',
        payment: 'efectivo',
        comments: ''
    });
    const [status, setStatus] = useState('idle');
    const [finalOrder, setFinalOrder] = useState(null);

    if (items.length === 0 && status !== 'success') {
        return <div className={styles.container}><p>Tu carrito está vacío.</p></div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        const orderId = Math.floor(Date.now() / 1000).toString();
        const order = {
            id: orderId,
            date: new Date().toISOString(),
            customer: { name: formData.name, phone: formData.phone },
            delivery: { method: formData.method, address: formData.address },
            payment: { method: formData.payment },
            items,
            total,
            comments: formData.comments,
            status: 'Nuevo'
        };

        try {
            // 1. Save to Sheets (via API)
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });

            if (!res.ok) throw new Error('Error al guardar pedido');

            // 2. Prepare WhatsApp
            const message = generateWhatsAppMessage(order);

            // 3. Clear Cart and Show Success
            clearCart();
            setFinalOrder({ ...order, message });
            setStatus('success');

        } catch (error) {
            console.error(error);
            alert('Hubo un error al guardar el pedido. Por favor intenta de nuevo.');
            setStatus('idle');
        }
    };

    if (status === 'success' && finalOrder) {
        const handleCancelAll = () => {
            setFinalOrder(null);
            setFormData({ name: '', phone: '', method: 'retiro', address: '', payment: 'efectivo', comments: '' });
            setStatus('idle');
            router.push('/');
        };

        const handleWhatsApp = () => {
            openWhatsApp(whatsappNumber || '5491112345678', finalOrder.message);
            setTimeout(() => {
                router.push('/');
            }, 500);
        };

        return (
            <div className={styles.container}>
                <div className={styles.success}>
                    <h2>¡Pedido Confirmado!</h2>
                    <p>Tu pedido #{finalOrder.id} ha sido registrado.</p>
                    <p>Para finalizar, envíanos el detalle por WhatsApp:</p>

                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.whatsappBtn}
                            onClick={handleWhatsApp}
                        >
                            Enviar a WhatsApp
                        </button>
                        <button
                            className={styles.cancelBtn}
                            onClick={handleCancelAll}
                        >
                            Cancelar Todo
                        </button>
                    </div>

                    <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#aaa' }}>
                        <p>Si el botón no funciona, copia este mensaje:</p>
                        <textarea
                            readOnly
                            className={styles.textarea}
                            value={finalOrder.message}
                            onClick={e => e.target.select()}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className="section-title">Finalizar Pedido</h1>
            <form className={styles.form} onSubmit={handleSubmit}>

                <div className={styles.group}>
                    <label className={styles.label}>Nombre Completo</label>
                    <input required name="name" className={styles.input} value={formData.name} onChange={handleChange} />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Teléfono</label>
                    <input required name="phone" type="tel" className={styles.input} value={formData.phone} onChange={handleChange} />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Forma de Entrega</label>
                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input type="radio" name="method" value="retiro" checked={formData.method === 'retiro'} onChange={handleChange} />
                            Retiro en Local
                        </label>
                        <label className={styles.radioLabel}>
                            <input type="radio" name="method" value="envio" checked={formData.method === 'envio'} onChange={handleChange} />
                            Envío a Domicilio
                        </label>
                    </div>
                </div>

                {formData.method === 'envio' && (
                    <div className={styles.group}>
                        <label className={styles.label}>Dirección de Entrega</label>
                        <input required name="address" className={styles.input} placeholder="Calle, Número, Barrio..." value={formData.address} onChange={handleChange} />
                    </div>
                )}

                <div className={styles.group}>
                    <label className={styles.label}>Forma de Pago</label>
                    <select name="payment" className={styles.select} value={formData.payment} onChange={handleChange}>
                        <option value="efectivo">Efectivo</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="mercadopago">Mercado Pago</option>
                    </select>
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Comentarios (Opcional)</label>
                    <textarea name="comments" className={styles.textarea} value={formData.comments} onChange={handleChange} />
                </div>

                <div className={styles.summary}>
                    <div className={styles.row}>
                        <span>Subtotal</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <div className={`${styles.row} ${styles.total}`}>
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
            </form>
        </div>
    );
}
