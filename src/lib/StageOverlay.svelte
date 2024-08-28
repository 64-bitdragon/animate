<script lang="ts">
    import stageOverlay from "./stageOverlay";

    export let width, height;

    // this layer is home for selection boxes, vertex handles, etc
    // anything that should overlay the stage

    let svg: SVGElement;

    // temporary rectangles can handle canvas scrolling, but not zooming
    stageOverlay.drawTemporaryRectangle = function (x: number, y: number):SVGRectElement {
        svg
            .querySelectorAll("rect")
            .forEach(x => svg.removeChild(x));

        let rect = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect",
        );

        rect.setAttribute("x", x + "px");
        rect.setAttribute("y", y + "px");
        svg.appendChild(rect);

        return rect;
    };

    stageOverlay.hideTemporaryRectangle = function(rect: SVGRectElement) {
        svg.removeChild(rect);
    }
</script>

<!-- 
Setting the svg to 1px by 1px, and then setting it's overflow to visible
that way we don't have to worry about resizing the svg every time the stage_container changes
I really hope this works in every browser    
-->
<svg
    id="overlay"
    bind:this={svg}
    viewBox="0 0 {width} {height}"
    width="{width}px"
    height="{height}px"
>
</svg>

<style lang="scss">
    svg {
        pointer-events: none;
        overflow: visible;
    }

    
</style>
