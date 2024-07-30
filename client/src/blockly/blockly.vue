<template>
  <k-layout>
    <div id="pageContainer">
      <div id="outputPane">
        <pre id="generatedCode"><code></code></pre>
        <div id="output"></div>
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
  data()
  {
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
    initTheme()
    {
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
    initBlockly()
    {
      Blockly.common.defineBlocks(blocks);

      const codeDiv = document.getElementById('generatedCode').firstChild;
      const blocklyDiv = document.getElementById('blocklyDiv');
      if (!this.theme)
      {
        this.workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox });
      } else
      {
        this.workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox, theme: this.theme });
      }


      const runCode = () =>
      {
        this.code = wordGenerator.workspaceToCode(this.workspace);
        codeDiv.innerText = this.code;
      };

      load(this.workspace);
      runCode();

      this.workspace.addChangeListener((e) =>
      {
        if (e.isUiEvent) return;
        save(this.workspace);
      });

      this.workspace.addChangeListener((e) =>
      {
        if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
          this.workspace.isDragging())
        {
          return;
        }
        runCode();
      });
    }
  },
  mounted()
  {
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

pre,
code {
  margin: 0;
  overflow: auto;

  caret-color: var(--fg1);
  color: var(--fg1);
  box-shadow: var(--k-card-shadow);
}

#pageContainer {
  display: flex;
  width: 100%;
  height: 100%;
}

#blocklyDiv {
  flex-basis: 100%;
  height: 100%;
  min-width: 600px;
}

#outputPane {
  display: flex;
  flex-direction: column;
  width: 30%;
  overflow: auto;
}

#generatedCode {
  height: 50%;
  width: 100%;
  background-color: var(--k-card-bg);
}

#output {
  height: 50%;
}
</style>