/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /\.mp3$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'static/audio/',
            publicPath: '/_next/static/audio/',
          },
        },
      });
      return config;
    },
    async rewrites() {
      return [
        {
          source: "/socket.io/:path*",
          destination: "http://localhost:5000/socket.io/:path*", // Proxy /socket.io to port 5000
        },
      ];
    },
  };
  
  export default nextConfig;
  