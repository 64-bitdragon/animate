import blackboard from "../blackboard";
import stage from "../stage";
import stageOverlay from "../stageOverlay";
import zoomHelper from "../util/zoom_helper";
import type { ITool } from "./tool.interface";

export class ZoomTool implements ITool {
    // mouseDownPos is in stage space
    mouseDownPos!: { x: number, y: number };

    // we are doing our own globalSpaceToStage space
    // as we can guarantee the stage hasn't been scaled during the box drawing
    // so we can cache the stage offset
    stageOffset!: { x:number, y:number };

    rect:SVGRectElement|null = null;

    select(): void {
        stage.svgContainer.addEventListener('mousedown', this.onMouseDown);
        stage.svgContainer.addEventListener('mouseup', this.onMouseUp);
        stage.svgContainer.style.cursor = 'zoom-in';
    }

    unselect(): void {
        stage.svgContainer.removeEventListener('mousedown', this.onMouseDown);
        stage.svgContainer.removeEventListener('mouseup', this.onMouseUp);
        stage.svgContainer.style.cursor = '';
    }

    //horrible syntax to preserve the 'this' value
    onMouseDown = (e: MouseEvent) => {
        //this is for mouseDown on the scroll bars
        let svgContainerRect = stage.svgContainer.getBoundingClientRect();

        console.log(e.clientX, svgContainerRect.x + stage.svgContainer.clientWidth);
        if(e.clientX > svgContainerRect.x + stage.svgContainer.clientWidth) {
            return;
        }

        if(e.clientY > svgContainerRect.y + stage.svgContainer.clientHeight) {
            return;
        }

        stage.svgContainer.addEventListener('mousemove', this.onMouseMove);

        this.stageOffset = stage.stageSpaceToGlobalSpace(0, 0);
        this.mouseDownPos = { x: e.clientX - this.stageOffset.x, y: e.clientY - this.stageOffset.y };
        
        this.rect = stageOverlay.drawTemporaryRectangle(this.mouseDownPos.x, this.mouseDownPos.y);
    }

    onMouseMove = (e: MouseEvent) => {
        let mouseMoveX = e.clientX - this.stageOffset.x;
        let mouseMoveY = e.clientY - this.stageOffset.y;

        // the min() and abs() handle if the user draws a box from bottom-right to top-left
        this.rect!.setAttribute('x', Math.min(mouseMoveX, this.mouseDownPos.x) + "px");
        this.rect!.setAttribute('y', Math.min(mouseMoveY, this.mouseDownPos.y) + "px");
        this.rect!.setAttribute('width', Math.abs(mouseMoveX - this.mouseDownPos.x) + "px");
        this.rect!.setAttribute('height', Math.abs(mouseMoveY - this.mouseDownPos.y) + "px");
    }

    onMouseUp = (e: MouseEvent) => {
        if(!this.rect) {
            //in case the user did something strange like mouse downing outside the stage container
            //and then mouse upping inside
            return;
        }

        stage.svgContainer.removeEventListener('mousemove', this.onMouseMove);
        if(this.rect) {
            stageOverlay.hideTemporaryRectangle(this.rect);
            this.rect = null;
        }

        let globalX = this.mouseDownPos.x + this.stageOffset.x;
        let globalY = this.mouseDownPos.y + this.stageOffset.y;

        // pythag, without the final square root
        let diff = (e.clientX - globalX) ** 2 + (e.clientY - globalY) ** 2;
        
        if(diff < 25) {
            // user clicked, rather than drawing a box

            let svgPoint = stage.globalSpaceToSvgSpace(e.clientX, e.clientY);

            if (e.button == 2) {
                // right click, zoom out
                stage.zoomAtPoint(zoomHelper.getNextZoomOutValue(blackboard.zoom.value), svgPoint.x, svgPoint.y);
            } else {
                stage.zoomAtPoint(zoomHelper.getNextZoomInValue(blackboard.zoom.value), svgPoint.x, svgPoint.y);
            }
        } else {
            // user drew a box

            // the min() and abs() handle if the user draws a box from bottom-right to top-left
            let svgBox = stage.globalSpaceToSvgSpace(Math.min(globalX, e.clientX), Math.min(globalY, e.clientY), Math.abs(e.clientX - globalX), Math.abs(e.clientY - globalY));
            stage.zoomToRect(svgBox.x, svgBox.y, svgBox.width!, svgBox.height!);
        }
    }
}