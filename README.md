## Coordinate Spaces
There are a number of different coordinate spaces used:
- svg space
    - this is the coordinate system inside the svg, relative to the svg viewbox
- stage space
    - this is the svg container element, width and height are affected by the zoom
- global space
    - relative to the top left of the window, use MouseEvent.clientX/Y for this space