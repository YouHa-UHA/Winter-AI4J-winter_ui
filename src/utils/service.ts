import axios, { AxiosError, type AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: '/winter',
    // 超时
    timeout: 50000
});
// 响应拦截器
service.interceptors.response.use(
    (res: AxiosResponse) => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        const msg = res.data.msg || ""
        // 二进制数据则直接返回
        if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
            console.log("二进制数据直接返回")
            return res.data
        }
        if (code === 401) {
            console.log('跳转到登录页')
            router.push('/login'); // 跳转到登录页
            return Promise.reject("用户未授权，需要登录"); // 阻止后续代码执行
        }
        else {
            return res.data
        }
    },
    (error: AxiosError) => {
        // 统一处理请求错误（如网络问题、超时等）
        console.error('拦截到请求错误:', error);

        // 判断是否为网络异常或其他非业务逻辑错误
        let { message } = error;
        if (message === "Network Error") {
            message = '操作失败，系统异常！';
        } else if (message.includes("timeout")) {
            message = '请求超时！';
        } else if (message.includes("Request failed with status code")) {
            message = `请求出错，请稍后重试！(${message.substr(-3)})`;
        }

        // 显示错误消息
        ElMessage.error(message);

        return Promise.reject(error); // 返回被拒绝的Promise，继续传递错误
    }
);
export default service;