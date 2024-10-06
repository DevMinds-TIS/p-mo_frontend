module.exports = {
    async rewrites() {
        return [
            {
                source: '/storage/:path*',
                destination: 'http://localhost:8000/storage/:path*', // Redirigir al backend
            },
        ]
    },
}
