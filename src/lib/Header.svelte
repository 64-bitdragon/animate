<script lang="ts">
    import blackboard from "./blackboard";

    let zoom = 100;
    blackboard.zoom.subscribe(x => zoom = x);

    const defaultOptions = [50, 75, 100, 150, 200, 300];
    let zoomOptions = defaultOptions;
    $: {
        zoomOptions = [...defaultOptions];
        if (!zoomOptions.includes(zoom)) {
            zoomOptions.push(zoom);
            zoomOptions.sort((a, b) => a - b);
        }

        blackboard.zoom.next(zoom);
        console.log(zoomOptions);
    }
</script>

<header>
    <select id="zoom" bind:value={zoom}>
        {#each zoomOptions as option}
        <option value={option}>{option}%</option>
        {/each}
    </select>
</header>

<style lang="scss">
    #zoom {
        margin-left: auto;
    }

    header {
        display: flex;
        height: 50px;
        
        border: 1px solid white;
        color: white;
        padding: 10px;
    }
</style>