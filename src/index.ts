import { Context, Logger, Random, Schema } from 'koishi';
import * as core from './src/index';
import { word } from './src/word';

export const name = 'word-core';

export * from './src/word';

export interface Config {
  masterID: string[];
}

export const Config: Schema<Config> = Schema.object({
  masterID: Schema.array(String)
});

export const logger = new Logger('Word-core');

// TypeScript 用户需要进行类型合并

export const apply = async (ctx: Context, config: Config) => {
  ctx.plugin(core);
  ctx.plugin(word);
  ctx.inject(['word'], async ctx => {
    ctx.command('word', '词库核心！');

    ctx.command('word').subcommand('add <question:text> <answer:text>', '为一个触发词添加回复').usage('添加一个词库')
      .example('word.add 你好 你也好')
      .action(async ({ session }, question, answer) => {
        if (!session) { return; }
        if (!question) { return `<at id="${session.username}" /> 你没有设置触发词`; }
        if (!answer) { return `<at id="${session.username}" /> 你没有设置回答`; }

        const uid = session.uid;

        const nowWordDB = await ctx.word.user.getEditWord(uid);
        const hasPermission = await ctx.word.permission.isHave(uid, `word.edit.${nowWordDB}`);

        if (!hasPermission || !config.masterID.includes(uid)) { return `<at id="${session.username}" /> 你没有词库【${nowWordDB}】的编辑权限`; }

        const a = await ctx.word.editor.addWordItem(nowWordDB, uid, question, answer);

        if (typeof a === 'number') {
          return `<at id="${session.username}" /> 添加到【${nowWordDB}】词库成功，序号为【${a}】`;
        } else {
          return a;
        }
      });

    ctx.command('word').subcommand('rm <question:text> <listNumber:text>', '删除触发词的回复').usage('序号为数字或者all')
      .example('word.rm 你好 all')
      .example('word.rm 你好 1')
      .action(async ({ session }, question, whichTemp) => {
        if (!session) { return; }
        if (question) { return `<at id="${session.username}" /> 你没有设置触发词`; }
        if (!/^\d+$|^all$/.test(whichTemp)) { return `<at id="${session.username}" /> 你没有设置需要被删除的序号或序号不正确`; }

        const uid = session.uid;
        const which = (whichTemp === 'all') ? 'all' : Number(whichTemp);

        const nowWordDB = await ctx.word.user.getEditWord(uid);
        const hasPermission = await ctx.word.permission.isHave(uid, `word.edit.${nowWordDB}`);

        if (!hasPermission || !config.masterID.includes(uid)) { return `<at id="${session.username}" /> 你没有词库【${nowWordDB}】的编辑权限`; }

        const a = await ctx.word.editor.rmWordItem(nowWordDB, uid, question, which);

        if (a === 'over') {
          return `<at id="${session.username}" /> 删除触发词成功`;
        } else {
          return `<at id="${session.username}" /> ${a}`;
        }
      });

    ctx.command('word').subcommand('setedit <dbname:text>', '选择库进行编辑').usage('当setedit后不加参数则代表选择为默认库')
      .action(async ({ session }, test) => {
        if (!session) { return; }
        let newDB = test;
        if (!test) { newDB = 'default'; }
        const uid = session.uid;

        const a = await ctx.word.user.setEditWord(uid, newDB);
        if (a) {
          return `<at id="${session.username}" /> 设置成功`;
        } else {
          return `<at id="${session.username}" /> 设置失败`;
        }
      });

    ctx.command('word').subcommand('readedit', '查看当前正在编辑的词库')
      .action(async ({ session }) => {
        if (!session) { return; }
        const uid = session.uid;

        const a = await ctx.word.user.getEditWord(uid);

        return `<at id="${session.username}" /> 你正在编辑【${a}】`;
      });

    ctx.command('word').subcommand('find <question:text>', '寻找某个触发词所在的词库')
      .action(async ({ session }, question) => {
        if (!session) { return; }
        const a = await ctx.word.editor.getQuestion(question);

        let outMsg = `<at id="${session.username}" /> 此关键词存在以下词库：`;
        a.forEach((value, index) => {
          outMsg = outMsg + `\n${index + 1}. ${value}`;
        });

        return outMsg;
      });

    ctx.command('word').subcommand('get <question:text>', '查看当前词库某触发词的所有回答')
      .action(async ({ session }, question) => {
        if (!session) { return; }
        if (!question) { return `<at id="${session.username}" /> 你没有输入需要查询的关键词`; }
        const nowDB = await ctx.word.user.getEditWord(session.uid);

        const a = await ctx.word.editor.readWord(nowDB);

        if (!a.data[question]) { return `<at id="${session.username}" /> 当前编辑词库没有此触发词`; }

        let outMsg = `<at id="${session.username}" /> 此关键词含有以下回答：`;
        a.data[question].forEach((value, index) => {
          outMsg = outMsg + `\n${index + 1}. ${value}`;
        });

        return outMsg;
      });

    // 设置存储格子
    ctx.command('word').subcommand('setsave <cell:text>', '设置当前词库的存储格子')
      .action(async ({ session }, cell) => {
        if (!session) { return; }
        if (!cell) { return `<at id="${session.username}" /> 你没有输入存储格子名称`; }

        const uid = session.uid;

        const nowWordDB = await ctx.word.user.getEditWord(uid);
        const hasPermission = await ctx.word.permission.isHave(uid, `word.edit.${nowWordDB}`);

        if (!hasPermission || !config.masterID.includes(uid)) { return `<at id="${session.username}" /> 你没有词库【${nowWordDB}】的编辑权限`; }

        const a = await ctx.word.editor.setSaveCell(nowWordDB, cell, uid);

        if (typeof a === 'boolean') {
          return `<at id="${session.username}" /> 修改成功`;
        } else {
          return `<at id="${session.username}" /> ${a}`;
        }
      });

    // 恢复默认存储格子
    ctx.command('word').subcommand('resetsave', '重置当前词库的存储格子')
      .action(async ({ session }) => {
        if (!session) { return; }

        const uid = session.uid;

        const nowWordDB = await ctx.word.user.getEditWord(uid);
        const hasPermission = await ctx.word.permission.isHave(uid, `word.edit.${nowWordDB}`);

        if (!hasPermission || !config.masterID.includes(uid)) { return `<at id="${session.username}" /> 你没有词库【${nowWordDB}】的编辑权限`; }

        const a = await ctx.word.editor.setSaveCell(nowWordDB, 'default', uid);

        if (typeof a === 'boolean') {
          return `<at id="${session.username}" /> 修改成功`;
        } else {
          return `<at id="${session.username}" /> ${a}`;
        }
      });

    ctx.command('word').subcommand('getsave', '查看当前词库的存储格子')
      .action(async ({ session }) => {
        if (!session) { return; }

        const uid = session.uid;

        const nowWordDB = await ctx.word.user.getEditWord(uid);

        const a = await ctx.word.editor.readSaveCell(nowWordDB, uid);

        return `<at id="${session.username}" /> 当前词库的存储格子为【${a}】`;

      });

    // 设置权限
    ctx.command('word').subcommand('addp <uid:string> <permission:text>', '增加权限')
      .action(async ({ session }, uid, permission) => {
        if (!session) { return; }

        const mid = session.uid;

        const hasPermission = await ctx.word.permission.isHave(mid, 'word.admin.add');
        if (!hasPermission || !config.masterID.includes(mid)) { return `<at id="${session.username}" /> 你没有词库的【添加权限】权限`; }

        const a = await ctx.word.permission.add(uid, permission);
        if (typeof a === 'boolean') {
          return (a) ? `<at id="${session.username}" /> 添加成功` : `<at id="${session.username}" /> 添加失败`;
        } else {
          return `<at id="${session.username}" /> ${a}`;
        }
      });

    // 取消权限
    ctx.command('word').subcommand('addp <uid:string> <permission:text>', '增加权限')
      .action(async ({ session }, uid, permission) => {
        if (!session) { return; }

        const mid = session.uid;

        const hasPermission = await ctx.word.permission.isHave(mid, 'word.admin.rm');
        if (!hasPermission || !config.masterID.includes(mid)) { return `<at id="${session.username}" /> 你没有词库的【删除权限】权限`; }

        const a = await ctx.word.permission.rm(uid, permission);
        if (typeof a === 'boolean') {
          return (a) ? `<at id="${session.username}" /> 添加成功` : `<at id="${session.username}" /> 添加失败`;
        } else {
          return `<at id="${session.username}" /> ${a}`;
        }
      });

    ctx.on('message', async (session) => {
      if (!session.content) { return; }
      const msg = await ctx.word.driver.start(session.content);
      if (!msg) { return; }
      session.send(msg);
    });

    // 上传
    // 下载
  });


};

// 编辑词库要权限

// . .    ........................................./@@`..... .............,@@.........=@@@@@@@@@`........ .             . 
// . .    ........................................\@]@^...................@@^..........@@`\O[@@@@^.......               . 
// . .  .......=@@@@@]`............................................. ....=@^.....@@@@].=@O.,`.\@@@@...... .........     . 
// . .  ......./@@@@@@@@@@@@@]]`........................................=@@......@@@@@@@@@^....,@@@@^.... .........     . 
// . . ........O@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\]]]].................,@@@@@@@@@@@@@@@@@@@`.....\@@@\.....,]........  ...
// . . ........=@@O/OOO@@@@@@@@@@@@@@@@O[[`.....[[[[[\@@@@@@@]`....,/@@@@@@@@@@O/[[O@^..[@@@.......,O@@^....,@\.......... 
// ... .........@@O..**..\@@@@@`............................O@@@@@@@@@@@@@@@@O\`....,`....\@\.........O@@.....=@\.=\......
// ... ...=O....=@@.........\@@@\`......................,@@@@[.....,@@@@@@O[[[[[[..........@@^.........,@@^....,@@.\@`....
// . .....=@`....\@^..../@@@@@@@@@@@]..........]@@@/`,@@@/............\@@@@@\...............@@^..........\@@.....\@`=@^...
// . ......@\.....@@`..=@@@@@@@@OO[[@@@@\`./@@@[...,@@/.................,@@@@O...............@@^..........,@@^....\@.,@^..
// . ....@^,@^.....@@`..=@@@@@@@O`.....=@@@[.....,@@/..................../@@@`.......=\......,@@^...........\@\....=^.....
// . ....=@`=@`....,@@`../@@@O......./@@[......,@@/.....................=@@@@O@@O`....O@\.....,@@^...........=@@..........
// . .....=@`=O.....,@@@@@@@/.....,/@@`.......=@@`......................@@@@@@@@@@@@@@@@@O`../@@@@^...........=@@`........
// . . ....,O........,@@@@/......O@@`........=@@.........................\\@@@@@@@@O[@@@@@@O@@@@/[`............,@@`.......
// . . ............./@@@O....../@@`.........=@@...........................@@....@O....,O@@@@@/....,@^...........,@@`......
// . . ............/@@@/.....=@@/.....`....=@@.........................../@`...=@`.......,[.........@\...........=@@`.....
// . .  ..........=@@@OOO]`.@@@`....=O.....@@^........................../@^...=@/....................@@...........\@\.....
// . .  ..........=@@@@@@@\@@@...../@.....=@@..........................,@@....@@......................@@...........@@^....
// .  ...............,\@@@@@O.....O@......=@^..........................O@^.../@`.......................@@..........=@^....
// ......../@^........=@@@@O...../@.......O@^.........................,@@...=@^.........................@@..........@@....
// ........=@^........=@@@@.....=@^.......O@^....,O...................=@^..=@@........O.................,@O.........=@\...
// .....,]`...]`.......\@@......@/........=@^....@/...................@@^.,@@`........@^.................=@\.........@@^..
// ....,[[[.`,[[......./@^.....=@`.......=@@@...=@^...................@@..@@^.........\@..................O@^........=@@..
// ........@@^........,@/......@O.......=@O\@^..O@...................=@@./@^..O^......=@^..................@@.........@@^.
// ...................=@......=@^......=@O**@@..@@^..................=@\/@/...OO......,@^..................=@\........=@@.
// ...................@/....../@^.....,@@`*..O@*@@@^................./@O@@\...,@^......@@...................@@`........@@^
// @@@@@@@@@@@@@@@@@@@@^......@@......@@^*....\O@@O@@`...............O@@@[@@`.=@@`.....O@...................=@^........=@@
// oOoOOOoOOOOooOOOoO@@^......@@.....=@O*.......O@*,\@@@]............@@O*..\@\=@@@.....=@^..................,@@.........@@
// @@@@@@@OOOOOOOOOOO@@.......@@.....@@^........./....,\@@@@@@@@OOOO/@@^....,@@@/O@]...=@^...................@@^........=@
// oOOOOOOOOOOOOOOOOO@^.......@@^...=@O.....,]]/O@@\`........[[[[[[\OO^..........*,\@@@@@O...................\@^.........@
// oOOOOOOOOOO@@OOOO@@^.......O@^...@@^,/@@@@@@/[[[`.............,@@@@@@@@@@@]]......**=@@...................=@^.........=
// oOOOOOOOOO@@@@OOO@@........=@^..=@@O/[..................................,[O@@@@]....,@@...................=@O..........
// oOOOOOOOOOOOOOOOO@O........=@O../@^............................................[[`...@@...................=@O..........
// oOOOOOOOOOOOOOOO@@^.........@@..@@...................................................@@...................=@^..........
// oOOOOOOOOOOOOOOO@@..........=@^.@O...................................................@@.................../@^..........
// oOOOOOOOOOOOOOO@@/...........@@=@^....*[[OO@@@@@^............../@@@@@@@OO`...........@@...................@@^..........
// oOOOOOOOOOOOOOO@@^............\O@O@@@@@@@@@@@@@@\............../@@@@@@@@@@@@@@@@\`...@@..................,@@....`......
// oOOOOOOOOOOOOOO@@............../@[@@@@@@@@@@@@@@^..............=@@@@@@@@@@@@@@@@@O..=@@..................=@O...,@^.....
// OoOOOOOOOOOOOO@@^..............@@.................................................../@^..................@@^....@@.....
// @OOoOOOOOOOOoO@O../@`..........@@..****....................................***.,*...@@^.................=@@.....=@`....
// oOOOOOOOOOOOO@@,@@/............@@`.................................................=@@..................@@^.....=@^....
// oOOOOOOOoOOO@@@@@@.............=@@................................................./@^.................=@^......=@^....
// oOOOOOOOOOO@@OO@@^..............\@\.................,.............................=@@....../^.........,@/.......@@`.,`.
// oOOOOOOOOOOOOOO@@................,@@]...............,@@O,/@@@/@@O.................@@^...../O..........@/.......=@@..@@.
// oOOOOOOOOOOOOOO@@..................\@@@`........................................./@/....,@@.........,O`.......,@@`..@@.
// oOOoOO@OOooOOOO@O..................=@/\@@@\`.................................,]@@@@..../@/...................,@@`...@O.
// oOOO@OoOOOOOOOO@O.................,@/....,[@@@@@\]`.....................]/@@@@@@@@..,/@@....................=@@`...=@^.
// oO@@OooOOOOOOoO@@.................@@...........[\@@@@@@@@@\]]]]`...**********,@@O]@@@O....................,@@/.....@@^.
// O@OOOOOOOOOOOoO@@`...............O@@.....]]]]/@@@O[,,*^/@@[[[[\@@`**********=@OOO[\@@..................../@@`.....=@@..
// OOOoOOOOOOOOOOoO@@..............=@@@O..=O@@@OO@@O,*`,*O@O******@@^****************/@^................../@@`.......@@^..
// oOOOOOOOOOOOOOOO@@^.............@@O@@@/O@@@@,@@O`**,`O@@****...,O`..........******O@^................/@@@@@`...../@^./@
// oOOOOOOoOOOOOOOOO@@^............@@OoO@@OOO[*@@O****/o@@^*......................***O@^..............,@@/**=@@^.../@@@@@O
// oOoOOOOOOOOOOOOOOO@@\..........=@@OOO@@[...=@@\/]`**O@@...........................O@@............,@@O`*...,@@^./@@OOOOo
// oOoOOOOOOOOOOOOOOOo@@@`........=@@O@@O`.,]O@@@@@@@@@@@O].........................,@@@\........../@@`**......@@@@OOOOOOO
// O@@@OoOOOOOOOOOOOOOOO@@@]......=@@@OO,@@@@O@@OO@@@O@@@@@@@@@O].................../@O@@\......../@O**........\@@OoOOOOOO
// OOOOOOOOOOOOOOOOOOOOOOOO@@@]`...@@@`=@@OO.*O@@@@@OOOOO@OOOO@@@@@@@@@@@\..........@@^=O@@......O@O*..........=@@OOOOOOOO
// @OOOOOOOOOOOOOOOOOOOOOOOOoOO@@@\@@@=@@@O`*=OO@@@OOOOOOO@OOOOOOO@@@@OO@@@@]]]`.]@@@@^,,O@@\...=@@*............@@oOOooOOO
// @OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO@@O@@@@O\.*O@@@@OOOOOOOOOOOOOOOOOO@@@OOOOO@@@@@@OO@@@@\,\O@@\`@@^.............@@OoOoOOOO
// @@OOOOOOOOOOOOOOOOOOOOOOOoOOoO@@@@@@@@OOOO@@O@@@@OOOOOOO@OO@@@@@@@@@@OOO@OOOOOOOOOOO@@@O]O@@@@@`.............@@OooOOOOO
// O@OOOOOOOOOOOOOOOO@@OOOOOOO@@@/`.=@@@OOO@OO@@@OOOOOOOOOO@@@@/`.....[\@@@@OOOOOOOOOOOOOO@@@@/*................O@OoOOOOOO
