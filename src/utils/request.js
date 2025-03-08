import axios from "axios"
import { useUserStore } from "@/stores"
import { ElMessage } from "element-plus"
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  baseURL,
  timeout: 2000
})
instance.interceptors.request.use(config => {
  // 发生请求前的处理
  const useStore = useUserStore()
  if (useStore.token) {
    config.headers.Authorization = useStore.token
  }

  return config
}, err => {
  // 请求错误处理

  return Promise.reject(err);
})

instance.interceptors.response.use(res => {
  //请求成功对响应数据做处理
  if (res.data.code === 0) { return res }
  ElMessage.error(res.data.message || '服务异常')
  return Promise.reject(res.data) //该返回对象会传到请求方法的响应对象中
}, err => {
  // 响应错误处理
  if (err.response?.status === 401) {
    router.push('/login')
  }
  ElMessage.error(err.response.data.message || '服务异常')
  return Promise.reject(err);
})

export default instance
export { baseURL }
