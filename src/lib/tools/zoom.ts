import blackboard from "../blackboard";
import stage from "../stage";
import type { ITool } from "./tool.interface";

export class ZoomTool implements ITool {
    select(): void {
        stage.svg.addEventListener('click', this.onClick);
    }

    unselect(): void {
        console.log("Method not implemented.");
    }

    onClick(e:MouseEvent) {
        let svgPoint = stage.stageSpaceToSvgSpace(e.offsetX, e.offsetY);
        stage.zoomAtPoint(blackboard.zoom.value + 100, svgPoint.x, svgPoint.y);
    }
}