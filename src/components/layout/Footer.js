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
                    <p className={styles.text}>Mar a Dom: 19:30 - 23:30</p>
                </div>

                <div className={styles.column}>
                    <h3 className={styles.title}>Contacto</h3>
                    <p className={styles.text}>📍 Güemes 226 - Barrio San Pedro </p>
                    <p className={styles.text}>📞 370-4xxxxx</p>
                    <p className={styles.text}>📧 contacto@laparrilla.com</p>
                </div>

                <div className={styles.column} style={{ flex: 1.5 }}>
                    <h3 className={styles.title}>Dónde Estamos</h3>
                    <div className={styles.mapContainer}>
                        <iframe
                            src="https://maps.app.goo.gl/ZRNwHcnhh2kU8o5b6"
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
