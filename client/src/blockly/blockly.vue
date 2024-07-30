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
      // 工具箱配置
      toolbox: {},
      // Blockly 生成的代码
      code: null
    };
  },
  methods: {
    // 初始化 Blockly
    initBlockly()
    {
      Blockly.common.defineBlocks(blocks);

      const codeDiv = document.getElementById('generatedCode').firstChild;
      const blocklyDiv = document.getElementById('blocklyDiv');
      this.workspace = Blockly.inject(blocklyDiv, { toolbox });

      const runCode = () =>
      {
        const code = wordGenerator.workspaceToCode(this.workspace);
        codeDiv.innerText = code;
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
    this.initBlockly();
  }
};
</script>

<style scoped>
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