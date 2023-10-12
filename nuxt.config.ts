// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      runtimeEnvironment: process.env.RUNTIME_ENVIRONMENT,
      app: {
        contracts: JSON.parse(process.env.DAODAO_CONTRACTS || '[]'),
        name: process.env.APP_NAME,
        assets: {
          logo: process.env.APP_LOGO,
          brand: process.env.APP_BRAND,
        },
        features: {
          VESTING_CONTRACTS: process.env.FEATURES__VESTING_CONTRACTS === 'true',
        },
        vesting: {
          deployerContract: process.env.VESTING_DEPLOYER_CONTRACT,
          codeId: process.env.VESTING_CODE_ID,
        },
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ['@/assets/css/app.css', 'vue-json-pretty/lib/styles.css'],
  modules: ['@pinia/nuxt'],
  app: {
    head: {
      title: `${process.env.APP_NAME} MultiSig`,
    },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {},
        },
      },
    },
  },
});
