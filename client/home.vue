<template>
    <k-layout>
        <div class="home">
            <!-- <div class="top-nav">

                <div class="title">{{ config.name }}</div>
            </div> -->
            <div class="conten">
                <div class="search-box">
                    <div class="search-container">
                        <input placeholder="输入想要查询的插件名">
                        <div class="search-btn"><i class="bi bi-search"></i></div>
                    </div>
                </div>
                <div class="statistics">
                    <div class="text"> {{ `当前有${Object.keys(pluginList).length}个可用于 forge${page.version}
                        版本的插件(${page.time})` }}
                    </div>
                </div>
                <div class="market-box">
                    <div class="market-grid">
                        <div class="item-grid" v-for="item of pluginList">
                            <div class="item">
                                <div class="header">
                                    <div class="icon"><i class="bi bi-plug"></i></div>
                                    <div class="info">
                                        <div class="name">{{ item.name }}</div>
                                        <div class="author">{{ item.author }}</div>
                                    </div>
                                </div>
                                <div class="text">{{ item.descriptor }}</div>
                                <div class="footer">
                                    <!-- <div class="tag">{{ item.tag }}</div> -->
                                    <div class="version"><i class="bi bi-tag"></i>{{ item.version }}</div>
                                    <div class="time">{{ formatTimestamp(item.update) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pageNum-box">
                    <div class="pageNum">
                        <div class="item" @click="page.now > 1 && page.now--"><i class="bi bi-chevron-left"></i></div>
                        <div v-for="item in page.max">
                            <div class="item"
                                @click="((page.now + 2) != item) && ((page.now - 2) != item) && (page.now = item)"
                                :class="item == page.now && 'active'"
                                v-if="((page.now + 2) >= item) && ((page.now - 2) <= item) || item == 1 || item == page.max">
                                {{
                    ((page.now + 2) !=
                        item) && ((page.now - 2) != item) || item == 1 || item == page.max ? item : '...' }}
                            </div>
                        </div>
                        <div class="item" @click="(page.now < page.max) && page.now++"><i
                                class="bi bi-chevron-right"></i>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </k-layout>
</template>
<style lang="scss" scoped>
/* 隐藏浏览器默认的滚动条 */
::-webkit-scrollbar {
    width: 8px;
}

/* 轨道部分（滚动条背景） */
::-webkit-scrollbar-track {
    background-color: transparent;
}

/* 滑块部分（可拖动的滚动条） */
::-webkit-scrollbar-thumb {
    background-color: #787875;
    border-radius: 6px;
}

/* 滑块悬停状态 */
::-webkit-scrollbar-thumb:hover {
    background-color: #E9E9E0;
}


.home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .top-nav {
        position: relative;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        border-bottom: #52525980 1px solid;
        flex-shrink: 0;

        .fold {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            margin: 0 0 0 12px;
        }

        .title {
            margin: 0 0 0 60px;
            font-weight: bolder;
        }
    }

    .conten {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;

        .search-box {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin: 24px 0 18px 0;
            background-color: #313136;
            border: none;
            box-shadow: none;

            .search-container {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                max-width: 550px;
                width: 80%;


                input {
                    max-width: 550px;
                    width: 100%;
                    background: #1F1F22;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    border-left: 24px solid transparent;
                    caret-color: rgba(255, 255, 245, 0.9);
                    color: rgba(255, 255, 245, 0.9);
                    padding: 12px 0px 12px 0px;

                    &::placeholder {
                        color: #67676C;
                        font-size: 14px;
                        padding: 0 0 0 4px;
                    }

                    &:focus {
                        outline: 2px solid #3b82f6;
                    }
                }

                .search-btn {
                    position: absolute;
                    right: 10px;
                    color: #7B7B77;
                    cursor: pointer;
                }
            }
        }

        .statistics {

            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: lighter;
            text-align: center;

            .text {
                width: 80%;
            }
        }

        .market-box {
            flex-grow: 1;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 24px 0 0 0;

            .market-grid {
                width: 90%;
                height: 100%;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
                grid-auto-rows: 200px;
                gap: 16px;

                .item-grid {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;



                    .item {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        max-width: 500px;
                        min-width: 300px;
                        background: #1F1F22;
                        border-radius: 8px;
                        transition: all 0.2s ease;
                        outline: transparent 2px solid;
                        cursor: pointer;

                        display: flex;
                        flex-direction: column;

                        &:hover {
                            outline: #3b82f6 2px solid;
                        }

                        .header {
                            display: flex;
                            flex-direction: row;
                            margin: 20px 0 0 16px;

                            .icon {
                                width: 50px;
                                height: 50px;
                                overflow: hidden;
                                border: 1px solid #525259;
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;

                                i {
                                    font-size: 32px;
                                    color: rgba(255, 255, 245, 0.9);
                                }
                            }

                            .info {
                                margin: 0 0 0 16px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;

                                .name {
                                    font-size: 16px;
                                }

                                .author {
                                    font-size: 12px;
                                    color: #aaa;
                                }
                            }
                        }

                        .text {
                            flex-grow: 1;
                            margin: 8px 16px;
                        }

                        .footer {
                            position: relative;
                            display: flex;
                            flex-direction: row;
                            margin: 12px 16px;
                            flex-wrap: nowrap;
                            white-space: nowrap;

                            .version {
                                font-size: 14px;
                                font-weight: bold;

                                i {
                                    font-size: 16px;
                                    margin: 0 8px 0 0;
                                }
                            }

                            .time {
                                position: absolute;
                                right: 0;
                                bottom: 0;
                                font-size: 12px;
                                color: #aaa;
                            }
                        }
                    }

                }
            }
        }

        .pageNum-box {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .pageNum {
                display: flex;
                flex-direction: row;
                margin: 20px 0 40px 0;

                .item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    border-radius: 4px;
                    height: 32px;
                    margin: 0 4px;
                    background: #1F1F22;
                }

                .active {
                    background: #3b82f6;
                }
            }
        }


    }
}
</style>
<script>

export default {
    data()
    {
        return {
            url: 'http://127.0.0.1:1145',
            config: {
                "name": "插件市场",
                "version": "0.0.0",
            },
            pluginList: {},

            page: {
                time: 0,
                now: 5,
                max: 10,
                version: '1.9'
            }
        };
    },
    methods: {
        async getList()
        {
            const resTemp = await fetch(`${this.url}/getList`);
            const res = await resTemp.json();

            this.pluginList = res;
            this.page.time = this.getCurrentFormattedTime();
        },
        async getPlugin(name)
        {
            return `${this.url}/getPlugin/${name}.js`;
        },
        formatTimestamp(timestamp)
        {
            const now = Date.now();
            const diff = now - timestamp;

            const minute = 60 * 1000;
            const hour = 60 * minute;
            const day = 24 * hour;
            const month = 30 * day;
            const year = 365 * day;

            if (diff < minute)
            {
                return '刚刚';
            } else if (diff < hour)
            {
                const minutes = Math.floor(diff / minute);
                return `${minutes}分钟前`;
            } else if (diff < day)
            {
                const hours = Math.floor(diff / hour);
                return `${hours}小时前`;
            } else if (diff < month)
            {
                const days = Math.floor(diff / day);
                return `${days}天前`;
            } else if (diff < year)
            {
                const months = Math.floor(diff / month);
                return `${months}个月前`;
            } else
            {
                const years = Math.floor(diff / year);
                return `${years}年前`;
            }
        },
        getCurrentFormattedTime()
        {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        },
    },
    mounted()
    {
        this.getList();
    },
};
</script>