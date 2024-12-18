/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // colors: {
        // background: "#202020",
        // foreground: "#F2F0E3",
        // default: "#F2F0E3",
        // primary: "#003770",
        // secondary: "#FF9B5A",
        // success: "#EA6611",
        // warning: "#FE7F2D",
        // danger: "#E30613",
        // content1: "#202020",
        // content2: "#242424",
        // content2Foreground: "#F2F0E3",
        // content3: "#2E2E2E",
        // content3Foreground: "#E0E0E0",
        // content4: "#383838",
        // content4Foreground: "#CCCCCC",
      // },
      // boxShadow: {
      //   small: '0px 0px 5px 0px rgb(0 0 0 / 0.05), 0px 2px 10px 0px rgb(0 0 0 / 0.2), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)',
      //   medium: '0px 0px 15px 0px rgb(0 0 0 / 0.06), 0px 2px 30px 0px rgb(0 0 0 / 0.22), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)',
      //   large: '0px 0px 30px 0px rgb(0 0 0 / 0.07), 0px 30px 60px 0px rgb(0 0 0 / 0.26), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)',
      // },
      // borderRadius: {
      //   small: '8px',
      //   medium: '12px',
      //   large: '14px',
      // },
      // borderWidth: {
      //   small: '1px',
      //   medium: '2px',
      //   large: '3px',
      // },
      // opacity: {
      //   disabled: '0',
      //   hover: '.9',
      // },
      // fontSize: {
      //   tiny: '0.75rem',
      //   small: '0.875rem',
      //   medium: '1rem',
      //   large: '1.125rem',
      // },
      // lineHeight: {
      //   tiny: '1rem',
      //   small: '1.25rem',
      //   medium: '1.5rem',
      //   large: '1.75rem',
      // },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#202020",
            foreground: "#F2F0E3",
            default: {
              DEFAULT: "#3D3D3D",
              foreground: "#F2F0E3",
            },
            primary: {
              DEFAULT: "#003770",
              foreground: "#F2F0E3",
              focus: "#003770"
            },
            secondary: "#FF9B5A",
            success: {
              DEFAULT: "#EA6611",
              foreground: "#F2F0E3",
              light: "#EA6611",
              background: "#EA6611",
              success: "#EA6611"
            },
            warning: "#FE7F2D",
            danger: {
              DEFAULT: "#E30613",
              foreground: "#F2F0E3",
            },
            content1: {
              DEFAULT: "#3D3D3D",
              foreground: "#F2F0E3"
            },
            // content2: "#242424",
            // content2Foreground: "#F2F0E3",
            // content3: "#2E2E2E",
            // content3Foreground: "#E0E0E0",
            // content4: "#383838",
            // content4Foreground: "#CCCCCC",
          },
        },
        light: {
          colors: {
            background: "#F2F0E3",
            foreground: "#202020",
            default: {
              DEFAULT: "#DFDAB9",
              foreground: "#202020",
              focus: "#F3EAD4"
            },
            primary: {
              DEFAULT: "#003770",
              foreground: "#F2F0E3",
              focus: "#003770",
            },
            secondary: "#FF9B5A",
            success: {
              DEFAULT: "#EA6611",
              foreground: "#F2F0E3",
              light: "#EA6611",
              background: "#EA6611"
            },
            warning: "#FE7F2D",
            danger: {
              DEFAULT: "#E30613",
              foreground: "#F2F0E3",
              background: "#E30613"
            },
            content1: {
              DEFAULT: "#DFDAB9",
              foreground: "#202020"
            },
            // content2: "#E0E0E0",
            // content2Foreground: "#202020",
            // content3: "#CCCCCC",
            // content3Foreground: "#000000",
            // content4: "#B0B0B0",
            // content4Foreground: "#101010",
          },
        },
      },
    }),
  ],
}
