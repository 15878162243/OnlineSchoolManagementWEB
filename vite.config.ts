import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from  'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8081, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域

    // 设置代理，根据我们项目实际情况配置
    proxy: {
      '/api': { //apiTest是自行设置的请求前缀，按照这个来匹配请求，有这个字段的请求，就会进到代理来
        target: 'http://localhost:8082',
        changeOrigin: true, //是否跨域
        rewrite: (path) => path.replace('/api', '') //重写匹配的字段，如果不需要放在请求路径上，可以重写为""
      }
    }
  },
   // 配置path，需要安装和引入
   resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
  

})

