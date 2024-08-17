<script lang="ts">
    import { onMount, tick } from "svelte";
    import tippy from "tippy.js";
    import type { ITool } from "./tools/tool.interface";
    import { ZoomTool } from "./tools/zoom";

    const tools: {
        name: string;
        svg: string;
        interface:ITool;
    }[] = [];

    tools.push({
        name: "zoom",
        svg: '<g style="fill:none;stroke:#d6d6d6;stroke-width:7.36483"><circle id="path1" cx="20.5" cy="20.5" r="16.32" /><path d="M 32,32 46,46"/></g>',
        interface: new ZoomTool()
    });

    let selectedTool:string = "zoom";

    onMount(async () => {
        for (let tool of tools) {
            tippy("#" + tool.name, {
                content: tool.name,
                placement: 'right',
            });
        }

        await tick();
        tools.find(x => x.name == selectedTool)!.interface.select();
    });

    function selectTool(name:string) {
        tools.find(x => x.name == selectedTool)!.interface.unselect();
        selectedTool = name;
        tools.find(x => x.name == selectedTool)!.interface.select();
    }
</script>

<toolbox>
    {#each tools as tool}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <svg
            id={tool.name}
            class:selected={tool.name == selectedTool}
            on:click={() => selectTool(tool.name)}
            width="50"
            height="50"
            viewBox="0 0 50 50"
            version="1.1"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:svg="http://www.w3.org/2000/svg">{@html tool.svg}</svg
        >
    {/each}
</toolbox>

<style lang="scss">
    toolbox {
        display: block;
        width: 40px;
        height: 100%;

        color: white;
        padding: 5px;

        svg {
            width: 100%;
            height: auto;
            padding: 5px;
            background-color: #555;
            cursor: pointer;

            &:hover {
                background-color: #888;
            }
        }
    }

    .selected {
        background-color: #888;
    }
</style>
