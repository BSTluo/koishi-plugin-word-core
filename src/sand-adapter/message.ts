import { Context, Dict, h, MessageEncoder, Random } from 'koishi';
import { wordBot } from './bot';

export class SandboxMessenger<C extends Context = Context> extends MessageEncoder<C, wordBot<C>>
{
    private buffer = '';

    private rules: Dict<h.Transformer> = Object.fromEntries(['image', 'img', 'audio', 'video', 'file'].map((type) =>
    {
        return [type, async (attrs) =>
        {
            const src = attrs.src || attrs.url;
            const type1 = type === 'image' ? 'img' : type;
            if (src.startsWith('file:'))
            {
                return h(type1, { ...attrs, src: `${this.bot.ctx.server.selfUrl}/sandbox/${src}` });
            }
            return h(type1, { ...attrs, src });
        }];
    }));

    async flush()
    {
        if (!this.buffer.trim()) return;
        const content = await h.transformAsync(this.buffer.trim(), this.rules);
        const session = this.bot.session(this.session.event);
        session.messageId = Random.id();
        // this.bot.ctx.console.broadcast(
        //     'word-sanbox-request',
        //     content
        // );
        this.bot.ctx.console.broadcast(
            'word-sanbox-request',
            content
        );
        if (session.event.message) { this.results.push(session.event.message); }
        this.buffer = '';
    }

    async visit(element: h)
    {
        const { type, attrs, children } = element;

        // console.log(element);
        switch (type)
        {
            case 'figure':
            case 'message': {
                await this.flush();
                await this.render(children);
                await this.flush();
                break;
            }

            case 'at': {
                let msg = '';
                if (attrs.name) { msg = attrs.name; }
                if (attrs.id) { msg = attrs.id; }
                this.buffer += `@${msg}`;
                break;
            }

            default: {
                this.buffer += element.toString();
                break;
            }
        }
    }
}