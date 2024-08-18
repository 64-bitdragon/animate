import blackboard from "../blackboard";
import stage from "../stage";
import zoomHelper from "../util/zoom_helper";
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
        stage.zoomAtPoint(zoomHelper.getNextZoomInValue(blackboard.zoom.value), svgPoint.x, svgPoint.y);
    }
}