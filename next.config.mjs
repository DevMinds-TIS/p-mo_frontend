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
  };
  
  export default nextConfig;