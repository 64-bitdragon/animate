interface StageOverlay {
    //x and y are in stage space
    drawTemporaryRectangle(x:number, y:number):SVGRectElement;
    hideTemporaryRectangle(rect:SVGRectElement):void;
}

let stageOverlay: StageOverlay = {} as StageOverlay;
export default stageOverlay;