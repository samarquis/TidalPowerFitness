import dotenv from 'dotenv';

dotenv.config();

const validateEnv = () => {
    const requiredEnv = [
        'DB_HOST',
        'DB_PORT',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'JWT_SECRET',
        'JWT_EXPIRES_IN',
    ];

    const missingEnv = requiredEnv.filter(envVar => !process.env[envVar]);

    if (missingEnv.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
    }

    if (process.env.PAYMENT_PROVIDER === 'square') {
        const requiredSquareEnv = [
            'SQUARE_ACCESS_TOKEN',
            'SQUARE_LOCATION_ID',
            'SQUARE_ENVIRONMENT',
        ];
        const missingSquareEnv = requiredSquareEnv.filter(envVar => !process.env[envVar]);
        if (missingSquareEnv.length > 0) {
            throw new Error(`Missing required Square environment variables for PAYMENT_PROVIDER=square: ${missingSquareEnv.join(', ')}`);
        }
    }
};

export default validateEnv;
