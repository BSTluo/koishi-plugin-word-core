import { Service, Context } from "koishi";
import { wordService } from './Service/index';
import { wordDriver } from "./Driver/Driver";

declare module 'koishi' {
    interface Context {
        word: word;
    }
}

export class word extends Service {
    wordService: wordService;
    wordDriver: wordDriver;

    constructor(ctx: Context) {
        super(ctx, 'word', true);

        this.wordDriver = new wordDriver(ctx);
        this.wordService = new wordService(ctx);
    }
}