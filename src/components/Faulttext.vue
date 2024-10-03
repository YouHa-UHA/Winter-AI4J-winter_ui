<template>
    <div @click="triggerFault">
        <p class="faulttext" :style="{ '--fault-text': `'${props.content}'` }">
            {{ messages }}
        </p>
    </div>
</template>

<script lang="ts" setup name="FaultText">
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps(
    {
        content: {
            type: String,
            default: "CONTEXT"
        },
        ifFault: {
            type: Boolean,
            default: false
        }
    }
);
// 定义储存文本元素的引用
const texts = ref<HTMLElement | undefined>(undefined);
const player = ref<number | undefined>(undefined);

const messages = ref('');
const typingSpeed = 100;
// 逐字显示消息的函数
const typeMessage = (message: string) => {
    let displayedMessage = '';
    let index = 0;

    const interval = setInterval(() => {
        if (index < message.length) {
            displayedMessage += message[index];
            messages.value = displayedMessage;
            index++;
        } else {
            clearInterval(interval);  // 消息显示完毕时清除定时器
        }
    }, typingSpeed);
};
defineExpose({ typeMessage });

const init = () => {
    // 获取所有 faulttext 类的元素
    const elements = document.getElementsByClassName("faulttext");
    if (elements.length > 0) {
        texts.value = elements[0] as HTMLElement;
    }
};

const triggerFault = () => {
    clearInterval(player.value);

    setTimeout(() => {
        clearInterval(player.value);
        if (texts.value) {
            texts.value.classList.remove("faulttext_fault");
            texts.value.style.transform = "";
            texts.value.style.clipPath = "";
        }
    }, 1000);

    player.value = window.setInterval(() => {
        if (texts.value) {
            texts.value.classList.add("faulttext_fault");
            texts.value.style.transform = `translate(${Math.random() * 20 - 10}%,${Math.random() * 20 - 10}%)`;

            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const h = Math.random() * 20 + 30;
            const w = Math.random() * 20 + 5;
            texts.value.style.clipPath = `polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`;
        }
    }, 30);
};

onMounted(() => {
    init();
    typeMessage(props.content); // 假设 typeMessage 是一个返回 Promise 的异步函数
    if (props.ifFault) {
        setTimeout(() => {
            triggerFault();
        }, 1500);
    }

});
onBeforeUnmount(() => {
    clearInterval(player.value);
});
</script>

<style scoped>
* {
    font-size: 2vmin;
    margin: 0;
    padding: 0;
}

.faulttext {
    font-weight: bold;
    font-size: 2rem;
    letter-spacing: 0.5rem;
    user-select: none;
}

.faulttext_fault::after,
.faulttext_fault::before {
    content: var(--fault-text);
    position: absolute;
    left: 0;
    top: 0;
    mix-blend-mode: screen;
}

.faulttext_fault::after {
    color: #ff0000;
    transform: translateX(2%);
}

.faulttext_fault::before {
    color: #0000ff;
    transform: translateX(-2%);
}
</style>