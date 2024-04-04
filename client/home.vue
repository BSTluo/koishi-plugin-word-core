<template>
    <k-layout>
        <div class="home">
            <div class="conten">
                <div class="search-box">
                    <div class="search-container">
                        <input placeholder="输入想要查询的插件名">
                        <div class="search-btn"><i class="bi bi-search"></i></div>
                    </div>
                </div>
                <div class="statistics">
                    <div class="text"> {{ `当前有${Object.keys(pluginList).length}个可用于 词库${page.version}
                        版本的插件(${page.time})` }}
                    </div>
                </div>
                <div class="market-box">
                    <div class="market-grid">
                        <div class="item-grid" v-for="item of subPlugList">
                            <div class="item">
                                <div class="header">
                                    <div class="icon"><i class="bi bi-plug"></i></div>
                                    <div class="info">
                                        <div class="name">{{ item.name }}</div>
                                        <div class="author">{{ item.author }}</div>
                                    </div>
                                    <!-- 安装卸载按钮 -->
                                    <div class="setup" @click="pluginSetup(item.name)">{{ (pluginStatusList[item.name])
                        ? '卸载' : '安装' }}
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
                        <div class="item" @click="page.now > 1 && page.now--">
                            <i class="bi bi-chevron-left" style="color: var(--fg1);"></i>
                        </div>
                        <div v-for="item in page.max">
                            <div class="item"
                                @click="((page.now + 2) != item) && ((page.now - 2) != item) && (page.now = item)"
                                :class="item == page.now && 'active'"
                                v-if="((page.now + 2) >= item) && ((page.now - 2) <= item) || item == 1 || item == page.max">
                                {{ ((page.now + 2) != item) && ((page.now - 2) != item) || item == 1 || item ==
                        page.max || page.max == 4 ? item : '...' }}
                            </div>
                        </div>
                        <div class="item" @click="(page.now < page.max) && page.now++"><i class="bi bi-chevron-right"
                                style="color: var(--fg1);"></i>
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
            background-color: var(--k-main-bg);
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
                box-shadow: var(--k-card-shadow);
                border-radius: 1.5rem;


                input {
                    max-width: 550px;
                    width: 100%;
                    background: var(--k-card-bg);
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    border-left: 24px solid transparent;
                    caret-color: var(--fg1);
                    color: var(--fg1);

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
                    color: var(--fg1);
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
                        background: var(--k-card-bg);
                        border-radius: 8px;
                        transition: all 0.2s ease;
                        // outline: transparent 2px solid;
                        cursor: pointer;
                        border: 1px solid var(--k-card-border);
                        display: flex;
                        flex-direction: column;
                        outline: #3b82f6 2px solid;
                        outline: transparent 2px solid;


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
                                    color: var(--fg1);
                                    // color: red;
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

                            .setup {}
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
                                color: var(--el-text-color-secondary);
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
                    background: var(--k-status-bg, var(--k-side-bg));
                    color: var(--el-text-color-placeholder);
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
import "bootstrap-icons/font/bootstrap-icons.css";
import { send } from '@koishijs/client';

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

            // {插件:true/false}
            pluginStatusList: {
                "plugin-1": {
                    "name": "Awesome Plugin 1",
                    "author": "developerX",
                    "icon": "magic",
                    "descriptor": "An amazing plugin for testing",
                    "update": "1697543711485",
                    "version": "1.2.0",
                    "tag": ["utility"]
                },
                "plugin-2": {
                    "name": "Super Toolset",
                    "author": "coder123",
                    "icon": "toolbox",
                    "descriptor": "Boost your productivity with this toolset",
                    "update": "1697543711485",
                    "version": "2.1.0",
                    "tag": ["productivity"]
                },
                "plugin-3": {
                    "name": "Data Cruncher",
                    "author": "analyticsPro",
                    "icon": "chart-bar",
                    "descriptor": "Plugin for data analysis and crunching",
                    "update": "1697543711485",
                    "version": "0.5.0",
                    "tag": ["data-analysis"]
                },
                "plugin-4": {
                    "name": "Security Guardian",
                    "author": "securityExpert",
                    "icon": "shield-alt",
                    "descriptor": "Enhance your application's security",
                    "update": "1697543711485",
                    "version": "1.0.0",
                    "tag": ["security"]
                },
                "plugin-5": {
                    "name": "Social Sharer",
                    "author": "socialGuru",
                    "icon": "share-alt",
                    "descriptor": "Share content easily on social media",
                    "update": "1697543711485",
                    "version": "3.0.0",
                    "tag": ["social-media"]
                },
                "plugin-6": {
                    "name": "Code Inspector",
                    "author": "codeReviewer",
                    "icon": "code",
                    "descriptor": "Review and analyze your codebase",
                    "update": "1697543711485",
                    "version": "1.5.0",
                    "tag": ["code-review"]
                },
                "plugin-7": {
                    "name": "AI Assistant",
                    "author": "aiEnthusiast",
                    "icon": "robot",
                    "descriptor": "Your virtual assistant powered by AI",
                    "update": "1697543711485",
                    "version": "2.2.0",
                    "tag": ["artificial-intelligence"]
                },
                "plugin-8": {
                    "name": "Image Editor Pro",
                    "author": "designMaster",
                    "icon": "image",
                    "descriptor": "Professional image editing capabilities",
                    "update": "1697543711485",
                    "version": "1.8.0",
                    "tag": ["design"]
                },
                "plugin-9": {
                    "name": "Language Translator",
                    "author": "linguistPro",
                    "icon": "language",
                    "descriptor": "Translate text between multiple languages",
                    "update": "1697543711485",
                    "version": "2.5.0",
                    "tag": ["translation"]
                },
                "plugin-10": {
                    "name": "Weather Tracker",
                    "author": "weatherGeek",
                    "icon": "sun",
                    "descriptor": "Stay updated with real-time weather information",
                    "update": "1697543711485",
                    "version": "1.1.0",
                    "tag": ["weather"]
                },
                "plugin-11": {
                    "name": "Finance Manager",
                    "author": "financePro",
                    "icon": "dollar-sign",
                    "descriptor": "Manage your finances with ease",
                    "update": "1697543711485",
                    "version": "1.7.0",
                    "tag": ["finance"]
                },
                "plugin-12": {
                    "name": "Task Scheduler",
                    "author": "organizer",
                    "icon": "clock",
                    "descriptor": "Efficiently schedule and manage your tasks",
                    "update": "1697543711485",
                    "version": "2.0.0",
                    "tag": ["task-management"]
                },
                "plugin-13": {
                    "name": "Game Booster",
                    "author": "gamerPro",
                    "icon": "gamepad",
                    "descriptor": "Optimize your system for gaming performance",
                    "update": "1697543711485",
                    "version": "1.3.0",
                    "tag": ["gaming"]
                },
                "plugin-14": {
                    "name": "Health Monitor",
                    "author": "healthExpert",
                    "icon": "heartbeat",
                    "descriptor": "Keep track of your health metrics",
                    "update": "1697543711485",
                    "version": "1.4.0",
                    "tag": ["health"]
                },
                "plugin-15": {
                    "name": "Chatbot Companion",
                    "author": "chatbotFan",
                    "icon": "comments",
                    "descriptor": "Converse with your virtual chatbot companion",
                    "update": "1697543711485",
                    "version": "2.3.0",
                    "tag": ["chatbot"]
                },
                "plugin-16": {
                    "name": "Education Hub",
                    "author": "eduMaster",
                    "icon": "graduation-cap",
                    "descriptor": "Access a wealth of educational resources",
                    "update": "1697543711485",
                    "version": "1.6.0",
                    "tag": ["education"]
                },
                "plugin-17": {
                    "name": "Travel Planner",
                    "author": "travelerX",
                    "icon": "plane",
                    "descriptor": "Plan your next adventure with ease",
                    "update": "1697543711485",
                    "version": "2.4.0",
                    "tag": ["travel"]
                },
                "plugin-18": {
                    "name": "Recipe Book",
                    "author": "chefExtraordinaire",
                    "icon": "utensils",
                    "descriptor": "Discover and save delicious recipes",
                    "update": "1697543711485",
                    "version": "1.9.0",
                    "tag": ["cooking"]
                },
                "plugin-19": {
                    "name": "Virtual Drum Kit",
                    "author": "musicianPro",
                    "icon": "drum",
                    "descriptor": "Play the drums in a virtual environment",
                    "update": "1697543711485",
                    "version": "1.0.1",
                    "tag": ["music"]
                },
                "plugin-20": {
                    "name": "Language Learning Assistant",
                    "author": "polyglotLearner",
                    "icon": "book",
                    "descriptor": "Assist in learning new languages effectively",
                    "update": "1697543711485",
                    "version": "2.6.0",
                    "tag": ["language-learning"]
                },
                "plugin-21": {
                    "name": "Fitness Tracker",
                    "author": "fitnessEnthusiast",
                    "icon": "dumbbell",
                    "descriptor": "Track your fitness journey with precision",
                    "update": "1697543711485",
                    "version": "1.0.2",
                    "tag": ["fitness"]
                }
            }
            ,
            page: {
                time: 0,
                now: 1,
                Pmax: 3,
                max: 0,
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
        // 安装卸载按钮按下
        pluginSetup(name)
        {
            if (!pluginStatusList[item.name])
            {
                pluginStatusList[item.name] = true;
                this.getWord(name);
            } else
            {
                pluginStatusList[item.name] = false;
                this.removeWord(name);
            }
        },

        // 卸载插件
        removeWord(name)
        {
            send('rmWord', name);
        },

        // 安装插件
        getWord(name)
        {
            send('getWord', name);
        }
    },
    async mounted()
    {
        this.getList();
    },
    computed: {
        subPlugList()
        {
            this.page.max = Math.ceil(Object.keys(this.pluginStatusList).length / this.page.Pmax);
            const start = (this.page.now - 1) * this.page.Pmax;
            const end = this.page.now * this.page.Pmax;
            console.log(start, end);
            return Object.values(this.pluginStatusList).slice(start, end);
        }
    }
};
</script>