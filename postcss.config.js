import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

export default {
  plugins: [
    tailwindcss('./tailwind.config.js'), // 显式指定配置文件路径
    autoprefixer,
  ],
}
