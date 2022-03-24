import {Shape, ShapeConfig} from 'konva/lib/Shape';
import {Node} from 'konva/lib/Node';
import {Context} from 'konva/lib/Context';
import {isLayoutNode} from './ILayoutNode';
import {GetSet} from 'konva/lib/types';
import {getset} from '../decorators';

export interface DebugConfig extends ShapeConfig {
  target: Node;
}

export class Debug extends Shape<DebugConfig> {
  @getset(null)
  public target: GetSet<Node, this>;

  public constructor(config?: DebugConfig) {
    super({
      strokeWidth: 2,
      stroke: 'red',
      ...config,
    });
  }

  _sceneFunc(context: Context) {
    const target = this.target();
    if (!target) return;

    const rect = target.getClientRect({relativeTo: this.getLayer()});
    const position = target.getAbsolutePosition(this.getLayer());
    const scale = target.getAbsoluteScale(this.getLayer());

    if (isLayoutNode(target)) {
      const ctx = context._context;
      const contentRect = target.getPadd().scale(scale).shrink(rect);
      const marginRect = target.getMargin().scale(scale).expand(rect);

      ctx.beginPath();
      ctx.rect(
        contentRect.x,
        contentRect.y,
        contentRect.width,
        contentRect.height,
      );
      ctx.rect(rect.x, rect.y, rect.width, rect.height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(180,255,147,0.5)';
      ctx.fill('evenodd');

      ctx.beginPath();
      ctx.rect(rect.x, rect.y, rect.width, rect.height);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(rect.x, rect.y, rect.width, rect.height);
      ctx.rect(marginRect.x, marginRect.y, marginRect.width, marginRect.height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,193,125,0.5)';
      ctx.fill('evenodd');

      ctx.beginPath();
      ctx.arc(position.x, position.y, 5, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fill();

      ctx.restore();
    } else {
      context.beginPath();
      context.rect(rect.x, rect.y, rect.width, rect.height);
      context.moveTo(position.x, position.y);
      context.arc(position.x, position.y, 4, 0, Math.PI * 2, false);
      context.closePath();
      context.strokeShape(this);
    }
  }
}