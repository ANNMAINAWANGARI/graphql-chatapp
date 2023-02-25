// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     appDir: true,
//   },
//   experiments:{
//     topLevelAwait: true
//   }
//   // webpack(config) {
//   //   config.experiments = { ...config.experiments, topLevelAwait: true }
//   //   return config
//   // },
  
// }

// module.exports = nextConfig
/** @type {import("next").NextConfig} */
module.exports = {
  experimental: { appDir: true },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  },
}