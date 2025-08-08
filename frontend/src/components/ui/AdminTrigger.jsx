import React from 'react';
import styles from './AdminTrigger.module.css';

const AdminTrigger = () => {
    const handleAdminLogin = () => {
        window.location.href = '/admin-login';
    };

    return (
        <button 
            className={styles.adminTrigger}
            onClick={handleAdminLogin}
        />
    );
};

export default AdminTrigger;