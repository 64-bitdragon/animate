interface Stage {
    height:number;
    svg: SVGElement;
    width:number;
    replaceStageSvg(svg:string):void;

    stageSpaceToSvgSpace(x:number, y:number):{x:number, y:number};
    svgSpaceToStageSpace(x:number, y:number):{x:number, y:number};

    svgSpaceToGlobalSpace(x:number, y:number):{x:number, y:number};

    // x and y are in svg space
    zoomAtPoint(newZoom:number, x:number, y:number):void;

    // zooms to the screen center, rather than the svg center
    // hint: it accounts for scrollbars
    zoomCenter(newZoom:number):void;
}

let stage: Stage = {} as Stage;
export default stage;
