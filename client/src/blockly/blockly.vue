<template>
  <k-layout>
    <div id="pageContainer">
      <div id="outputPane">
        <div class="outCode">
          <div class="wordMenuTitle">工作区运行结果</div>
          <div class="generatedCode"></div>
          <div class="menuButton">
            <div class="copyButton" @click="copy()">粘贴到下方输入框</div>
            <div class="runButton" @click="run()">运行</div>
          </div>
        </div>
        <div id="output">
          <div class="wordMenuTitle">测试沙盒</div>
          <div class="wordMenu">
            <div class="msgBoxs">
              <div class="msgBox" v-for="(item, index) of msgData">
                <div class="msgItemBox" :style="{ justifyContent: item.user == 'bot' ? 'flex-start' : 'flex-end' }">
                  <div class="msgItem">
                    <div class="msg" v-html="item.msg">
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="msg" v-for="(index, key) of 100" :key="i">
                <div>{{ `${index} ${key}` }}</div>
              </div> -->
            </div>
            <div class="sendBox">
              <div class="sendInputBox">
                <input class="sendInput" placeholder="输入调试的指令吧~~"></input>
              </div>
              <div class="sendButtonBox" @click="sendMessage()">
                <div class="sendButton"><i class="bi bi-cursor"></i></div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div id="blocklyDiv"></div>
    </div>
  </k-layout>
</template>

<script>
import "bootstrap-icons/font/bootstrap-icons.css";
// 引入 Blockly
import * as Blockly from 'blockly';
import { blocks } from './blocks/index';
import { save, load } from './serialization';
import { toolbox } from './toolbox';
// import './index.css';
import { wordGenerator } from './generators/word';
import { receive, send, useContext } from "@koishijs/client";

export default {
  name: 'word-blockly',
  data() {
    return {
      // Blockly 工作区实例
      workspace: null,
      // Blockly 生成的代码
      code: null,
      // 定义主题
      nightTheme: null,
      lightTheme: null,
      msgData: []
    };
  },
  methods: {
    // 初始化 Blockly
    initTheme(isDark) {
      if (isDark) {
        this.workspace.setTheme(this.nightTheme);
      } else {

        this.workspace.setTheme(this.lightTheme);
      }

    },
    initBlockly() {
      Blockly.common.defineBlocks(blocks);
      const codeDiv = document.getElementsByClassName('generatedCode')[0];

      const blocklyDiv = document.getElementById('blocklyDiv');

      this.workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox });

      const runCode = () => {
        this.code = wordGenerator.workspaceToCode(this.workspace);
        codeDiv.innerText = this.code;
      };

      // load(this.workspace);
      runCode();

      this.workspace.addChangeListener((e) => {
        if (e.isUiEvent) return;
        // save(this.workspace);
      });

      this.workspace.addChangeListener((e) => {
        if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
          this.workspace.isDragging()) {
          return;
        }
        runCode();
      });
    },
    // 发送信息按钮
    sendMessage() {
      const msgDom = document.getElementsByClassName('sendInput')[0];

      if (!msgDom.value) { return; }

      this.msgData.push({
        user: 'user',
        msg: msgDom.value
      });
      send('sandbox-send', msgDom.value);

      msgDom.value = '';

      const chatContainer = document.getElementsByClassName("msgBoxs")[0];
      chatContainer.scrollTop = chatContainer.scrollHeight;

    },
    copy() {
      const msgDom = document.getElementsByClassName('sendInput')[0];
      msgDom.value = this.code;
    },
    run() {
      this.copy();
      this.sendMessage();
    }
  },
  mounted() {
    this.nightTheme = Blockly.Theme.defineTheme('night', {
      'componentStyles': {
        'workspaceBackgroundColour': '#131313',   // 工作区背景色
        'toolboxBackgroundColour': '#2f2e2b',     // 工具箱背景色
        'toolboxForegroundColour': '#f5f5f5',     // 工具箱类别文字颜色
        'flyoutBackgroundColour': '#252526',      // 弹出背景颜色
        'flyoutForegroundColour': '#333',         // 弹出标签文本颜色
        'flyoutOpacity': 1,                       // 弹出不透明度
      }
    });

    this.lightTheme = Blockly.Theme.defineTheme('light', {
      'componentStyles': {
        'workspaceBackgroundColour': '#e7e7e7',   // 工作区背景色
        'toolboxBackgroundColour': '#b7b7b7',     // 工具箱背景色
        'toolboxForegroundColour': '#000000',     // 工具箱类别文字颜色
        'flyoutBackgroundColour': '#a6a6a6',      // 弹出背景颜色
        'flyoutForegroundColour': '#333',         // 弹出标签文本颜色
        'flyoutOpacity': 1,                       // 弹出不透明度
      }
    });

    this.initBlockly();
    this.initTheme(window.document.documentElement.classList.contains('dark'));

    receive('word-sanbox-request', dataTemp => {
      let data = dataTemp.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');

      this.msgData.push({
        user: 'bot',
        msg: data
      });

      setTimeout(() => {
        const chatContainer = document.getElementsByClassName("msgBoxs")[0];
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 10);
    });

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {

          const isDark = window.document.documentElement.classList.contains('dark');
          this.initTheme(isDark);
        }
      }
    });

    observer.observe(window.document.documentElement, { attributes: true });

    document.getElementsByClassName('sendInput')[0].addEventListener("keyup", event => {
      if (event.key === "Enter") {
        this.sendMessage();
      }
    });
  }
};
</script>

<style lang="scss" scoped>
k-layout {
  margin: 0;
  max-width: 100%;
  max-height: 100%;
}

#pageContainer {
  display: flex;
  width: 100%;
  height: 100%;

  #outputPane {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 30%;
    overflow: auto;

    .outCode {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      height: 29%;
      width: 95%;
      border: 1px solid var(--k-color-divider);
      background-color: var(--k-status-bg, var(--k-side-bg));

      .wordMenuTitle {
        height: 15%;
        width: 95%;
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 1.3rem;
      }

      .generatedCode {
        top: 3%;
        height: 67%;
        width: 100%;
        word-break: break-all;
        white-space: normal;
        margin: 10px;
      }

      .menuButton {
        height: 15%;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: row;

        .copyButton {
          height: 100%;
          width: 50%;
          border: 1px solid var(--k-color-divider);
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-direction: row;
          cursor: pointer;
        }

        .runButton {
          height: 100%;
          width: 50%;
          border: 1px solid var(--k-color-divider);
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-direction: row;
          cursor: pointer;
        }
      }
    }

    #output {
      height: 69%;
      width: 95%;
      border: 1px solid var(--k-color-divider);
      background-color: var(--k-status-bg, var(--k-side-bg));
      overflow: hidden;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;

      .wordMenuTitle {
        height: 7%;
        width: 95%;
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 1.3rem;
      }

      .wordMenu {
        height: 93%;
        width: 100%;
        display: flex;
        flex-direction: column;

        .msgBoxs {
          width: 96%;
          height: 93%;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          scroll-behavior: smooth;
          margin: 2%;

          .msgBox {
            width: 100%;
            margin-top: 10px;

            .msgItemBox {
              display: flex;
              justify-content: flex-end;
              width: 100%;

              .msgItem {
                width: max-content;
                max-width: 90%;
                display: flex;
                border: 2px solid var(--k-color-divider);
                border-radius: 10px;
                justify-content: center;
                align-items: center;

                .msg {
                  margin: 10px;
                  word-break: break-all;
                }
              }
            }
          }


        }

        .sendBox {
          width: 100%;
          height: 8%;
          display: flex;
          flex-direction: row;
          align-items: center;

          .sendInputBox {
            width: 90%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .sendInput {
              width: 90%;
              height: 70%;
              background: var(--k-card-bg);
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              caret-color: var(--fg1);
              color: var(--fg1);
              box-shadow: var(--k-card-shadow);
              border: 2px solid var(--k-color-divider);

              &::placeholder {
                color: #67676C;
                font-size: 14px;
                padding: 0 0 0 4px;
              }

              &:focus {
                outline: 2px solid #3b82f6;
              }
            }
          }

          .sendButtonBox {
            height: 4vh;
            width: 4vh;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-right: 10px;

            .sendButton {
              height: 90%;
              width: 90%;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 2px solid var(--k-color-divider);
              border-radius: 50%;

              &:hover {
                border: 2px solid #3b82f6;
              }

              i {
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--fg1);
                font-size: 1.4rem;
              }
            }
          }
        }
      }
    }

    #output {
      height: 69%;
      width: 95%;
      border: 1px solid var(--k-color-divider);
      background-color: var(--k-status-bg, var(--k-side-bg));

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;

      .wordMenu {
        height: 92%;
        width: 100%;
      }
    }
  }

  #blocklyDiv {
    flex-basis: 100%;
    height: 100%;
    min-width: 600px;
  }
}
</style>