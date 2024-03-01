<template>
    <div class="app">
        <div class="bg" v-if="$store.state.isSidebar && $store.state.isMobile" @click="$store.state.isSidebar = 0"></div>

        <div class="sidebar" ref="sidebar"
            :style="{ marginLeft: $store.state.isSidebar ? '0' : '-' + sidebarW + 'px', position: $store.state.isMobile ? 'absolute' : 'relative' }">
            <div class="item" v-for=" item in 5" :class="active == item ? 'item-acitve' : ''" @click="active = item">
                <i class="bi bi-browser-firefox"></i>
            </div>
        </div>
        <k-slot name="word-view" class="view"></k-slot>
    </div>
</template>
<style>
* {
    margin: 0;
    padding: 0;
}
</style>
<style lang="scss" scoped>
.app {
    width: 100vw;
    height: 100vh;
    background: #313136;
    color: rgba(255, 255, 245, 0.9);
    display: flex;
    flex-direction: row;
    overflow: hidden;
    font-family: "Chinese Quotes", "Inter var", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

    .bg {
        position: fixed;
        height: 100vh;
        width: 100vw;
        left: 0;
        top: 0;
        z-index: 1;
        background: #00000066;
    }

    .sidebar {
        position: relative;
        height: 100%;
        background: #1E1E20;
        padding: 12px 6px 0 8px;
        border-right: 1px solid #52525980;
        overflow: hidden;
        flex-shrink: 0;
        margin-left: 0;
        transition: all 0.3s ease;
        z-index: 2;



        .item {
            z-index: 999;

            width: 48px;
            height: 48px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            margin: 0 0 8px 0;
            color: rgba(255, 255, 245, 0.4);
            transition: all .3s ease;


            i {
                font-size: 24px;
            }

            &:hover {
                background: #313136;
                color: rgba(255, 255, 245, 0.9);
            }

            &::after {
                position: absolute;
                content: ' ';
                width: 0px;
                height: 30px;
                border-radius: 0px 4px 4px 0px;
                background: rgba(255, 255, 245, 0.9);
                left: 0;
                transition: all 0.2s ease;

            }


        }

        .item-acitve {
            color: rgba(255, 255, 245, 0.9);

            &::after {
                position: absolute;
                content: ' ';
                width: 4px;
                height: 30px;
                border-radius: 0px 4px 4px 0px;
                background: rgba(255, 255, 245, 0.9);
                left: 0;
            }
        }
    }

    .view {
        flex-grow: 1;
    }
}
</style>
<script>
export default {
    data () {
        return {
            active: 1,
            sidebarW: 0,
            AspectRatio: {
                height: 0,
                width: 0,
                rat: 0,
            },
        }
    },
    mounted () {
        this.sidebarW = this.$refs.sidebar.clientWidth
        window.addEventListener("resize", this.getWindowSize);
        this.getWindowSize();

        this.$store.state.sidebarShow = this.sidebarShow

    },
    methods: {
        getWindowSize () {
            this.$nextTick(() => {
                const asp = this.AspectRatio;
                asp.height = window.innerHeight;
                asp.width = window.innerWidth;
                asp.rat = asp.height / asp.width;
                if (this.AspectRatio.rat > 0.8) {
                    if (this.$store.state.isMobile == 0) {
                        this.$store.state.isMobile = 1;
                        this.$store.state.isSidebar = 0;
                    }
                } else {
                    if (this.$store.state.isMobile == 1) {
                        this.$store.state.isMobile = 0;
                        this.$store.state.isSidebar = 1;
                    }
                }
            });
        },
        // sidebarShow () {
        //     const sidebar = this.$refs.sidebar
        //     this.$store.state.isMobile ? (
        //         this.$store.state.isSidebar ? (
        //             sidebar.style.marginLeft = 0,
        //             this.$store.state.isSidebar = 0
        //         ) : (
        //             sidebar.style.marginLeft = `-${sidebar.clientWidth}px`,
        //             this.$store.state.isSidebar = 1
        //         )
        //     ) : (
        //         sidebar.style.marginLeft = 0
        //     )

        // }

    },


}
</script>