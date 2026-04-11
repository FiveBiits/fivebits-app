import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    return (
        <div style={{ 
            textAlign: 'center', 
            marginTop: '100px', 
            fontFamily: '"JetBrains Mono", monospace' 
        }}>
            <h1 style={{ color: '#28a745', fontSize: '2.5rem' }}>✓ Payment Successful!</h1>
            <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
                Thank you for your payment. Your booking has been confirmed.
            </p>
            <Link to="/" style={{ 
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
            }}>
                Back to Home
            </Link>
        </div>
    );
};

export default PaymentSuccess;