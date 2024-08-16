interface Stage {
    height:number;
    svg: SVGElement;
    width:number;
    replaceStageSvg(svg:string):void;
}

let stage: Stage = {} as Stage;
export default stage;
