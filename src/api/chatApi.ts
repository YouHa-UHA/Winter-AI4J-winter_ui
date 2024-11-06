import request from '@/utils/request';

export const getChatId = async (params: any) => {
    return await request.post({
        url: '/chat/create',
        data: params
    })
}


export const userLogin = async (params: any) => {
    return await request.post({
        url: '/user/login',
        data: params
    })
}

export const getFollow = async (params: any) => {
    try {
        const response = await request.post({
            url: '/chat/follow',
            data: params
        });
        return response;
    } catch (error) {
        console.error("联想请求失败:", error);
        throw error; // 根据需要可以决定是否重新抛出异常
    }
}

export const getHistoryList = async (param: any) => {
    return await request.post({
        url: '/chat/list',
        data: param
    })
}

export const getChatHistory = async (param: any) => {
    return await request.post({
        url: '/chat/query',
        data: param
    })
}

export const checkLogin = async () => {
    return await request.post({
        url: '/user/isLogin'
    })
}

export const logout = async () => {
    return await request.post({
        url: '/user/logout'
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
