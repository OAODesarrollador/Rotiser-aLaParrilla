import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                <div className={styles.column}>
                    <h3 className={styles.title}>La Parrilla</h3>
                    <p className={styles.text}>
                        La mejor comida casera, carnes asadas y minutas.<br />
                        Hacé tu pedido online y recibilo en tu casa.
                    </p>
                    <br />
                    <h4 className={styles.title} style={{ fontSize: '1rem' }}>Horarios</h4>
                    <p className={styles.text}>Mar a Dom: 11:00 - 14:00</p>
                    <p className={styles.text}>Mar a Dom: 19:30 - 23:30</p>
                </div>

                <div className={styles.column}>
                    <h3 className={styles.title}>Contacto</h3>
                    <p className={styles.text}>📍 Av. Siempre Viva 123</p>
                    <p className={styles.text}>📞 11-1234-5678</p>
                    <p className={styles.text}>📧 contacto@laparrilla.com</p>
                </div>

                <div className={styles.column} style={{ flex: 1.5 }}>
                    <h3 className={styles.title}>Dónde Estamos</h3>
                    <div className={styles.mapContainer}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105073.23949906466!2d-58.43329845000001!3d-34.61582375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca3b4ef90cbd%3A0xa0b3812e88e88e87!2sBuenos%20Aires%2C%20C%ABA!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar"
                            className={styles.map}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

            </div>
            <div className={styles.copyright}>
                © {new Date().getFullYear()} La Parrilla. Todos los derechos reservados.
            </div>
        </footer>
    );
}
