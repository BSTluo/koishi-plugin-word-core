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
          <div class="text">
            {{ `当前有${Object.keys(pluginList).length}个可用于词库的插件，词库市场的发布暂时还在制作` }}
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
                  <div class="setup">
                    <div class="setupButton" @click="pluginSetup(item.name)"
                      :style="{ background: (pluginStatusList[item.dbName]) ? 'var(--el-color-success)' : 'var(--el-color-primary)' }">
                      {{ (pluginStatusList[item.dbName]) ? '卸载' : '安装' }}
                    </div>
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
              <div class="item" @click="((page.now + 2) != item) && ((page.now - 2) != item) && (page.now = item)"
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

    <div class="el-message el-message--error" role="alert" style="top: 16px; z-index: 2133;" v-if="error">
      <p class="el-message__content">
        {{ errorMsg }}
      </p>
    </div>

    <div class="el-message el-message--success" role="alert" style="top: 16px; z-index: 2544;" v-if="success">
      <p class="el-message__content">
        {{ successMsg }}
      </p>
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
          box-shadow: var(--k-card-shadow);
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

          i {
            color: var(--fg1);
          }
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
            outline: transparent 2px solid;


            &:hover {
              outline: var(--active) 2px solid;
            }

            .header {
              display: flex;
              flex-direction: row;
              margin: 20px 0 0 16px;
              position: relative;

              .icon {
                width: 50px;
                height: 50px;
                overflow: hidden;
                border: 1px solid #525259;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;

                i {
                  font-size: 32px;
                  color: var(--fg1);
                  // color: red;
                }
              }

              .info {
                margin: 0 0 0 16px;
                display: flex;
                white-space: nowrap;
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

              .setup {
                // --el-color-primary 安装
                // --el-color-success 安装成功
                // --el-color-danger 卸载
                position: relative;
                white-space: nowrap;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: row-reverse;
                align-items: center;

                .setupButton {
                  position: absolute;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 60%;
                  right: 15px;
                  border-radius: 4px;
                  font-size: 14px;
                  border: 1px solid var(--el-color-primary);
                  color: var(--k-button-hover-bg);
                  transition: var(--color-transition);

                  padding: 0 16px;

                  &:hover {
                    background: var(--el-button-hover-bg-color) !important;
                    color: var(--k-color-active);
                  }
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
  data() {
    return {
      url: 'http://127.0.0.1:1145',
      config: {
        "name": "插件市场",
        "version": "0.0.0",
      },
      pluginList: {},

      // {插件:true/false}
      pluginStatusList: {},
      page: {
        time: 0,
        now: 1,
        Pmax: 10,// 页面最多呈现几个
        max: 0,
        version: '1.9'
      },
      success: false,
      successMsg: '',
      error: false,
      errorMsg: '',
    };
  },
  methods: {
    async getList() {
      const resTemp = await fetch(`${this.url}/getList`);
      const res = await resTemp.json();

      this.pluginList = res;
      this.page.time = this.getCurrentFormattedTime();
      const list = await send('getWordList')
      for (let item of list) {
        this.pluginStatusList[item] = true;
      }
    },
    async getPlugin(name) {
      return `${this.url}/getPlugin/${name}.js`;
    },
    formatTimestamp(timestamp) {
      const now = Date.now();
      const diff = now - timestamp;

      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;
      const month = 30 * day;
      const year = 365 * day;

      if (diff < minute) {
        return '刚刚';
      } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes}分钟前`;
      } else if (diff < day) {
        const hours = Math.floor(diff / hour);
        return `${hours}小时前`;
      } else if (diff < month) {
        const days = Math.floor(diff / day);
        return `${days}天前`;
      } else if (diff < year) {
        const months = Math.floor(diff / month);
        return `${months}个月前`;
      } else {
        const years = Math.floor(diff / year);
        return `${years}年前`;
      }
    },
    getCurrentFormattedTime() {
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
    async pluginSetup(name) {
      const dbName = this.pluginList[name].dbName
      if (!this.pluginStatusList[dbName]) {
        const a = await this.getWord(name);
        if (a != "ok") { this.newError(a); return; }
        this.pluginStatusList[dbName] = true;
        this.newSuccess('插件安装成功');
      } else {
        const a = await this.removeWord(name);
        if (a != "ok") { this.newError(a); return; }
        this.pluginStatusList[dbName] = false;
        this.newSuccess('插件卸载成功');
      }
    },

    // 卸载插件
    async removeWord(name) {
      console.log('开始卸载插件', name);
      return await send('rmWord', name);
    },

    // 安装插件
    async getWord(name) {
      console.log('开始安装插件', name);
      return await send('getWord', name);
    },

    async newError(msg) {
      this.errorMsg = msg;
      this.error = true;

      setTimeout(() => {
        this.error = false;
        this.errorMsg = '';
      }, 2000);
    },

    async newSuccess(msg) {
      this.successMsg = msg;
      this.success = true;

      setTimeout(() => {
        this.success = false;
        this.successMsg = '';
      }, 2000);
    }
  },
  async mounted() {
    const a = await send('getPluginServerUrl');
    this.url = a;
    this.getList();
  },
  computed: {
    subPlugList() {
      this.page.max = Math.ceil(Object.keys(this.pluginList).length / this.page.Pmax);
      const start = (this.page.now - 1) * this.page.Pmax;
      const end = this.page.now * this.page.Pmax;
      // console.log(start, end);
      return Object.values(this.pluginList).slice(start, end);
    }
  }
};
</script>