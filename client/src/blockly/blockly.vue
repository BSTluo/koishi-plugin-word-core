<template>
  <k-layout>
    <div id="pageContainer">
      <div id="outputPane">
        <div class="outCode">
          <div class="wordMenuTitle">编写结果</div>
          <pre id="generatedCode"><code></code></pre>
          <div class="menuButton">
            <div class="copyButton">复制</div>
            <div class="runButton">运行</div>
          </div>
        </div>
        <div id="output">
          <div class="wordMenuTitle">操作面板</div>
          <div class="wordMenu"></div>
        </div>
      </div>
      <div id="blocklyDiv"></div>
    </div>
  </k-layout>
</template>

<script>
// 引入 Blockly
import * as Blockly from 'blockly';
import { blocks } from './blocks/index';
import { save, load } from './serialization';
import { toolbox } from './toolbox';
// import './index.css';
import { wordGenerator } from './generators/word';

export default {
  name: 'word-blockly',
  data() {
    return {
      // Blockly 工作区实例
      workspace: null,
      // Blockly 生成的代码
      code: null,
      // 定义主题
      theme: null
    };
  },
  methods: {
    // 初始化 Blockly
    initTheme() {
      this.theme = Blockly.Theme.defineTheme('night', {
        'componentStyles': {
          'workspaceBackgroundColour': '#131313',   // 工作区背景色
          'toolboxBackgroundColour': '#2f2e2b',     // 工具箱背景色
          'toolboxForegroundColour': '#f5f5f5',     // 工具箱类别文字颜色
          'flyoutBackgroundColour': '#252526',      // 弹出背景颜色
          'flyoutForegroundColour': '#333',         // 弹出标签文本颜色
          'flyoutOpacity': 1,                       // 弹出不透明度

        }
      });
    },
    initBlockly() {
      Blockly.common.defineBlocks(blocks);

      const codeDiv = document.getElementById('generatedCode').firstChild;
      console.log(codeDiv);
      const blocklyDiv = document.getElementById('blocklyDiv');
      if (!this.theme) {
        this.workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox });
      } else {
        this.workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox, theme: this.theme });
      }


      const runCode = () => {
        this.code = wordGenerator.workspaceToCode(this.workspace);
        codeDiv.innerText = this.code;
      };

      load(this.workspace);
      runCode();

      this.workspace.addChangeListener((e) => {
        if (e.isUiEvent) return;
        save(this.workspace);
      });

      this.workspace.addChangeListener((e) => {
        if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
          this.workspace.isDragging()) {
          return;
        }
        runCode();
      });
    }
  },
  mounted() {
    this.initTheme();
    this.initBlockly();
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
        font-size: 2rem;
      }

      #generatedCode {
        top: 3%;
        height: 67%;
        width: 100%;

        pre,
        code {
          overflow: auto;
        }
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
        }

        .runButton {
          height: 100%;
          width: 50%;
          border: 1px solid var(--k-color-divider);
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-direction: row;
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