interface Stage {
    svg: SVGElement;
    replaceContent(svg:string):void;
}

let stage: Stage = null as any as Stage;
export default stage;

export function setStage(newStage: Stage) {
    stage = newStage;
}