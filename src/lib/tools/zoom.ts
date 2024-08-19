import blackboard from "../blackboard";
import stage from "../stage";
import zoomHelper from "../util/zoom_helper";
import type { ITool } from "./tool.interface";

export class ZoomTool implements ITool {
    select(): void {
        stage.svgContainer.addEventListener('mouseup', this.onClick);
        stage.svgContainer.style.cursor = 'zoom-in';
    }

    unselect(): void {
        stage.svgContainer.style.cursor = '';
    }

    onClick(e:MouseEvent) {
        // literally no idea how this works
        // the offset would be relative to the top left of the container
        // not the svg
        // but somehow it works fine
        let svgPoint = stage.stageSpaceToSvgSpace(e.offsetX, e.offsetY);

        if(e.button == 2) {
            // right click, zoom out
            stage.zoomAtPoint(zoomHelper.getNextZoomOutValue(blackboard.zoom.value), svgPoint.x, svgPoint.y);
        } else {
            stage.zoomAtPoint(zoomHelper.getNextZoomInValue(blackboard.zoom.value), svgPoint.x, svgPoint.y);
        }
    }
}