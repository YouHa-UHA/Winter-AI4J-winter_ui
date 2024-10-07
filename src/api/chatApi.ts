import request from '@/utils/request';

export const getChatId = async (params: any) => {
    return await request({
        url: '/chat/create',
        method: 'post',
        data: params
    })
}


export const userLogin = async (params: any) => {
    return await request({
        url: '/user/login',
        method: 'post',
        data: params
    })
}


// 创建一个SSE连接，并返回一个关闭连接的函数，请求方式为GET
const createSSEWithGet = (onMessageCallback: (msg: string) => void) => {
    const eventSource = new EventSource('/api/chat/sse');

    eventSource.onmessage = (event) => {
        // 调用传入的回调方法处理消息
        if (typeof onMessageCallback === 'function') {
            onMessageCallback(event.data);
        }
    };

    eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        eventSource.close();
    };

    // 返回一个函数用于关闭SSE连接
    return () => {
        eventSource.close();
    };
};
const createSSEWithPost = (params: any, onMessageCallback: (msg: string) => void) => {

}