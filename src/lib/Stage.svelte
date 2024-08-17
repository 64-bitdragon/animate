<script lang="ts">
    import { onMount, tick } from "svelte";
    import stage from "./stage";
    import blackboard from "./blackboard";

    let scale = 1;
    let stageElement:HTMLElement;

    onMount(() => {
        refreshStageFromSvg();

        // start observing for resize
        resize_ob.observe(stageElement);
        blackboard.zoom.subscribe((x) => {
            scale = x / 100;
            console.log(scale);
            relayout();
        });
    });

    function refreshStageFromSvg() {
        stage.svg = stageElement.querySelector("svg")!;

        let viewBox = stage.svg.getAttribute("viewBox")!;
        let parts = viewBox.split(" ");
        stage.width = parseFloat(parts[2]);
        stage.height = parseFloat(parts[3]);
    }

    stage.replaceStageSvg = function (svg: string) {
        stage.svg.outerHTML = svg;
        refreshStageFromSvg();
    }

    stage.zoomAtPoint = async function(newZoom:number, x:number, y:number) {
        let global = stage.svgSpaceToGlobalSpace(x, y);

        blackboard.zoom.next(newZoom);
        await tick();

        let newGlobal = stage.svgSpaceToGlobalSpace(x, y);
        stageElement.scrollBy(newGlobal.x - global.x, newGlobal.y - global.y);
    }

    stage.zoomCenter = async function(newZoom:number) {
        
    }

    stage.svgSpaceToGlobalSpace = function(x:number, y:number):{x:number, y:number} {
        let svgRect = stage.svg.getBoundingClientRect();
        let svgWidth = stage.width;

        // svgSpace to stageSpace, and then add on the svg offset to make it global
        return {
            x: (x * svgRect.width) / svgWidth + svgRect.x,
            y: (y * svgRect.width) / svgWidth + svgRect.y
        };
    }

    stage.svgSpaceToStageSpace = function(x:number, y:number):{x:number, y:number} {
        let stageWidth = stage.svg.getBoundingClientRect().width;
        let svgWidth = stage.width;

        // hint: the aspect ratio of the stage and svg are the same
        // so stageWidth/svgWidth == stageHeight/svgHeight
        return {
            x: (x * stageWidth) / svgWidth,
            y: (y * stageWidth) / svgWidth
        };
    }

    stage.stageSpaceToSvgSpace = function(x:number, y:number):{x:number, y:number} {
        let stageWidth = stage.svg.getBoundingClientRect().width;
        let svgWidth = stage.width;

        // hint: the aspect ratio of the stage and svg are the same
        // so svgWidth/stageWidth == svgHeight/stageHeight
        return {
            x: (x * svgWidth) / stageWidth,
            y: (y * svgWidth) / stageWidth
        };
    }

    const resize_ob = new ResizeObserver(() => {
        relayout();
    });

    function relayout() {
        let containerRect = stageElement.getBoundingClientRect();

        let containerAspect = containerRect.width / containerRect.height;
        let stageAspect = stage.width / stage.height;

        let newWidth;
        let newHeight;
        if (containerAspect > stageAspect) {
            //scale by height
            newHeight = (containerRect.height - 20) * scale;
            newWidth = newHeight * stageAspect;
        } else {
            //scale by width
            newWidth = (containerRect.width - 20) * scale;
            newHeight = newWidth / stageAspect;
        }

        stage.svg.style.left =
            Math.max((containerRect.width - newWidth) / 2, 10) + "px";
        stage.svg.style.top =
            Math.max((containerRect.height - newHeight) / 2, 10) + "px";
        stage.svg.style.width = newWidth + "px";
        stage.svg.style.height = newHeight + "px";
    }
</script>

<!-- svelte-ignore component-name-lowercase -->
<stage bind:this={stageElement} style="overflow: {scale > 1 ? 'scroll' : 'hidden'}">
    <svg
        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg"
        width="210mm"
        height="297mm"
        viewBox="0 0 210 297"
        version="1.1"
        id="svg1"
        xml:space="preserve"
        inkscape:version="1.3 (0e150ed6c4, 2023-07-21)"
        sodipodi:docname="drawing.svg"
        ><sodipodi:namedview
            id="namedview1"
            pagecolor="#ffffff"
            bordercolor="#999999"
            borderopacity="1"
            inkscape:showpageshadow="2"
            inkscape:pageopacity="0"
            inkscape:pagecheckerboard="0"
            inkscape:deskcolor="#d1d1d1"
            inkscape:document-units="mm"
            inkscape:zoom="0.72426347"
            inkscape:cx="396.95499"
            inkscape:cy="561.25984"
            inkscape:window-width="1920"
            inkscape:window-height="1009"
            inkscape:window-x="-8"
            inkscape:window-y="-8"
            inkscape:window-maximized="1"
            inkscape:current-layer="layer1"
        /><defs id="defs1" /><g
            inkscape:label="Layer 1"
            inkscape:groupmode="layer"
            id="layer1"
            ><path
                style="fill:#000000;fill-opacity:1"
                d="m 69.437006,178.24169 c -5.22551,-4.60636 -5.22551,-4.60636 -6.90924,-3.84292 -12.43996,5.64055 -29.83158,1.07205 -43.267217,-11.3656 -2.01024,-1.86092 -2.01024,-1.86092 -2.58194,-0.84371 -5.846855,10.40305 -24.4874167,7.94604 -26.6367667,-3.51099 -0.1006903,-0.53672 -0.2079303,-0.97585 -0.2383103,-0.97585 -0.0304,0 -1.03874,0.64705 -2.24079,1.43789 -9.47981,6.23682 -20.84502,4.00013 -26.601113,-5.23515 -8.431138,-13.5272 1.524112,-26.66175 26.326553,-34.73416 7.0459903,-2.29325 7.0459903,-2.29325 5.0693103,-4.17091 -5.6947303,-5.40943 -7.9071703,-12.22862 -6.4296303,-19.817373 0.43449,-2.23157 0.555,-2.14207 -2.40445,-1.78562 -8.27603,0.9968 -10.077541,2.09207 -10.413723,6.33128 -0.409144,5.159243 -3.632218,8.308083 -6.779738,6.623583 -3.239289,-1.73362 -0.127999,-11.749583 4.493777,-14.466513 1.234558,-0.72574 1.234558,-0.72574 8.687784,-0.80686 7.45322,-0.0811 7.45322,-0.0811 8.54559,-1.91984 3.4004703,-5.723847 9.1411003,-9.840655 14.9333803,-10.709265 1.17131,-0.17565 1.17131,-0.17565 1.27062,-6.03584 0.1667,-9.836528 3.29646,-13.793209 11.3881617,-14.397036 7.840632,-0.585092 6.449812,6.490503 -1.52223,7.744112 -5.2075317,0.818889 -6.0980417,1.709793 -6.8751117,6.878154 -0.78585,5.22671 -0.75209,5.32288 1.92919,5.49659 5.0456917,0.3269 11.5981437,3.364028 13.0300537,6.039558 0.42824,0.80019 0.65134,0.6035 1.15577,-1.01896 7.43308,-23.908078 20.65627,-33.504898 34.68094,-26.433775 11.8003,5.949615 12.62192,16.866605 5.38757,26.566875 -1.40109,1.87867 -1.20723,2.44658 -0.68376,2.44658 2.23987,0 7.55099,4.489117 9.11679,7.705747 4.3595,8.955793 0.26813,17.445123 -10.56383,21.919253 -1.50573,0.62193 -1.50573,0.62193 0.62467,2.89483 14.94077,15.9401 18.68603,37.58575 8.63236,49.8906 -0.91624,1.1214 -1.76974,2.18372 -1.89666,2.36071 -0.15138,0.21108 0.88033,2.34974 2.99868,6.21606 3.94231,7.19534 4.09502,7.0912 -2.22669,1.51855 z m -13.69308,-4.81893 c 8.62993,-1.77498 14.74558,-7.98858 16.5681,-16.83346 0.63415,-3.07756 0.61524,-3.17609 -0.57197,-2.98068 -12.27704,2.0208 -21.31187,7.83866 -25.33768,16.31588 -1.34816,2.83885 -1.3475,3.47629 0.004,3.68172 2.20655,0.33545 7.30146,0.23535 9.33772,-0.18346 z m -18.22789,-4.4092 c 6.1427,-16.06898 16.08353,-23.61993 31.04902,-23.58451 4.49044,0.0106 4.18004,0.26467 3.51443,-2.87636 -0.86974,-4.1043 -1.36776,-4.95875 -2.88842,-4.9556 -17.88699,0.037 -42.23174,16.07283 -42.23174,27.8179 0,0.93351 7.61245,5.00604 9.79093,5.23799 0.0735,0.008 0.41811,-0.72991 0.76578,-1.63942 z M 8.0214423,165.38248 c 9.8024767,-3.37254 15.0783237,-26.01515 10.5358367,-45.21711 -1.32437,-5.59838 -20.0928367,16.41257 -24.4997867,28.73244 -3.74067,10.45724 4.20829,19.84111 13.96395,16.48467 z m -28.5194603,-6.22312 c 3.03394,-0.58049 6.33733,-2.24883 9.02326,-4.55709 0.72465,-0.62275 0.91495,-1.04525 1.2358,-2.74365 1.6690403,-8.83483 8.7511403,-19.23084 21.928772,-32.18985 2.48132,-2.44016 3.66267,-3.77031 3.34852,-3.77031 -3.33613,0 -16.1121917,2.62409 -22.7394217,4.67049 -23.8693933,7.37053 -34.5215753,17.70619 -29.9539353,29.06388 2.933205,7.29358 9.569282,10.9783 17.157005,9.52653 z m 44.770644,-14.25858 c 10.39864,-12.34857 19.16215,-16.3922 37.94243,-17.50728 1.56435,-0.0929 2.84427,-0.22329 2.84427,-0.2898 0,-0.28295 -2.95756,-4.08747 -4.2921,-5.52123 -1.6055,-1.72487 -2.51872,-1.75247 -12.11206,-0.366 -13.89448,2.00809 -25.66236,9.00573 -25.66566,15.26179 -10e-4,2.25971 -0.45691,9.11102 -0.66819,10.04572 -0.20095,0.88897 -0.0781,0.78682 1.95131,-1.6232 z m 21.77482,-29.27185 c 19.42706,-1.91098 29.24585,-11.85083 22.17145,-22.444823 -4.60138,-6.890637 -14.70128,-5.068007 -29.08873,5.24931 -5.40614,3.876773 -16.98813,14.852603 -16.34817,15.492563 1.12379,1.12379 17.19462,2.30012 23.26545,1.70295 z m -29.139047,-3.04069 c 0.7507,-0.67937 0.80862,-5.31896 0.0629,-5.03963 -2.465755,0.92364 -7.3526567,5.40938 -6.197985,5.6892 1.27292,0.30847 5.580385,-0.14759 6.135065,-0.64957 z M 31.721826,99.800177 c 8.51671,-7.71281 17.87451,-13.068777 24.34167,-13.932027 2.59884,-0.3469 3.51413,-1.33759 5.85256,-6.334708 7.69954,-16.453536 -13.9262,-33.350938 -25.69125,-12.691098 -4.90671,8.616356 -13.65647,23.889493 -15.33889,38.605066 -0.68948,6.03073 -0.77625,6.00446 3.8906,1.1782 2.29196,-2.37024 5.41735,-5.44168 6.94531,-6.825433 z"
                id="path1"
                sodipodi:nodetypes="sssssssssssssssssssssssscsssssssssscsssscccsscsccsssssssssssscsssscscsssssssssscsssssc"
            /></g
        ></svg
    >
</stage>

<style lang="scss">
    stage {
        display: flex;
        height: 100%;
        position: relative;

        border: 1px solid white;
        color: white;
        padding: 10px;
    }

    svg {
        background-color: white;
        position: absolute;
        overflow: visible;
    }
</style>
