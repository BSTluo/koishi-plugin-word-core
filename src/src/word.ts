import { Service, Context } from "koishi";
import { CacheFunction, ToolsFunction, wordService } from './Service/index';
import { wordDriver } from "./Driver/Driver";
import { Editor } from "./Service/Editor/Editor";
import { Permission } from "./Service/Permission/Permission";
import { UserFunction } from "./Service/User/User";
import { triggerType } from "./extend/trigger";

declare module 'koishi' {
    interface Context {
        word: word;
    }
}

export class word extends Service {
    wordDriver: wordDriver;
    cache: CacheFunction;
    editor: Editor;
    tools: ToolsFunction;
    user: UserFunction;
    trigger: triggerType;
    permission: Permission;

    constructor(ctx: Context) {
        super(ctx, 'word', true);

        this.wordDriver = new wordDriver(ctx);
        const wordServiceTemp = new wordService(ctx);
        this.cache = wordServiceTemp.Cache;
        this.editor = wordServiceTemp.Editor;
        this.tools = wordServiceTemp.Tools;
        this.user = wordServiceTemp.User;
        this.permission = wordServiceTemp.Permission;
        this.trigger = wordServiceTemp.trigger;

    }
}