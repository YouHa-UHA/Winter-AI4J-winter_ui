import axios, { type AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';
class UnauthenticatedError extends Error {
    constructor(message = '未登录 或登录已过期') {
        super(message);
        this.name = 'UnauthenticatedError';
    }
}
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: '/winter',
    // 超时
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
});
// 响应拦截器
service.interceptors.response.use(
    async (response: AxiosResponse) => {
        if (response.status === 208) {
            router.push('/login'); // 跳转到登录页
            return Promise.reject(new UnauthenticatedError()); // 阻止后续代码执行
        }

        return response; // 返回正常响应数据
    },
    (error) => {
        // 统一处理请求错误（如网络问题、超时等）
        // console.error('请求错误:', error);

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