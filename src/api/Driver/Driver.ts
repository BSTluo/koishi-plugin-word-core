import { Context, Service } from 'koishi';

export class wordDriver extends Service {
    constructor(ctx:Context){
        super(ctx, 'word', true);
    }
}
