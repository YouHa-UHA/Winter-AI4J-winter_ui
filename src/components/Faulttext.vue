<template>
    <div @click="triggerFault">
        <p class="faulttext" :style="{ '--fault-text': `'${props.content}'` }">
            <!-- <p v-for="(text, index) in textCount" :key="index" class="faulttext"> -->
            {{ props.content }}
        </p>
    </div>
</template>

<script lang="ts" setup name="FaultText">
import { ref, onMounted } from "vue";

const props = defineProps(
    {
        content: {
            type: String,
            default: "CONTEXT"
        }
    }
);
// 定义储存文本元素的引用
const texts = ref<HTMLElement>();
const player = ref<number | undefined>(undefined);
const textCount = 4; // 文字的数量

const init = () => {
    // 获取所有 faulttext 类的元素
    texts.value = Array.from(document.getElementsByClassName("faulttext"))[0] as HTMLElement;
};

const triggerFault = () => {
    clearInterval(player.value);

    setTimeout(() => {
        clearInterval(player.value);
        texts.value.classList.remove("faulttext_fault");
        texts.value.style.transform = "";
        texts.value.style.clipPath = "";
    }, 1000);

    player.value = window.setInterval(() => {
        texts.value.classList.add("faulttext_fault");
        texts.value.style.transform = `translate(${Math.random() * 60 - 30}%,${Math.random() * 60 - 30}%)`;

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const h = Math.random() * 50 + 50;
        const w = Math.random() * 40 + 10;
        texts.value.style.clipPath = `polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`;
    }, 30);
};

onMounted(() => {
    init();
    setTimeout(() => {
        triggerFault()
    }, 2000);
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