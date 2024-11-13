// // next.config.mjs
// const nextConfig = {
//     reactStrictMode: true,
// };


// export default nextConfig;

// next.config.mjs
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
      LARAVEL_PUBLIC_BACKEND_URL: process.env.LARAVEL_PUBLIC_BACKEND_URL,
    },
    output: 'export',
  };
  
  export default nextConfig;