# koishi-plugin-word-core

<div align="center">
  <a href="https://koishi.chat/" target="_blank">
    <img width="160" src="https://koishi.chat/logo.png" alt="logo">
  </a>
</div>

[![npm](https://img.shields.io/npm/v/koishi-plugin-word-core?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-word-core)

> 词库引擎
>
> 小型文字游戏引擎/对话插件

# 快速使用

## 简介

[文档 WIKI 地址](https://docs.reifuu.icu/src/3.0/)

`word-core`是一款设置对话的插件，类似于`dialogue`插件，可以通过设置`触发词`以及`回答`来让机器人与你对话

你编写的问答会存储在`库`中，默认为`default`库，当你进入一个`不存在的库`并且`编辑`它的时候，会自动新建一个库，库作者是你自己

每个`库`都有作者，非作者无法修改库的内容，库的作者可以添加`别的用户`为`词库作者`而进行一起编写

你设定的`触发词`可以拥有`多个回答`，当你触发触发词的时候，会从回答中`随机输出一条回答`

在你添加或删除问答的时候，默认会被添加或删除到 `default`这个 `词库`，你可以通过指令修改你想要编辑的词库

## 联系我们

快来和我们聊天！！！

作者QQ：1946831552

词库交流群：312762918

## 附属插件列表

基础语法包：[https://github.com/BSTluo/koishi-plugin-word-core-grammar-basic](https://github.com/BSTluo/koishi-plugin-word-core-grammar-basic)

基础触发器：[https://github.com/BSTluo/koishi-plugin-word-core-event-trigger-basic](https://github.com/BSTluo/koishi-plugin-word-core-event-trigger-basic)

花园触发器：[https://github.com/BSTluo/koishi-plugin-word-core-iirose-event-trigger](https://github.com/BSTluo/koishi-plugin-word-core-iirose-event-trigger)
