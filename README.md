## Coordinate Spaces
There are a number of different coordinate spaces used:
- svg space
    - this is the coordinate system inside the svg, relative to the svg viewbox
- stage space
    - this is svg space, after it's been scaled for zooming and layout
    - mouse events from the svg will have their offsetX and offsetY properties in stage space