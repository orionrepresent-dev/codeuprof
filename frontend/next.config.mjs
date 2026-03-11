/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    swcMinify: true, // Enables SWC compiler to minify output, improving performance and framer motion support
    env: {
        NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production'
            ? 'https://api.codigodoeuprofundo.com'
            : 'http://localhost:8000',
    },
};

export default nextConfig;
