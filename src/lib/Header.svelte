<script lang="ts">
    import blackboard from "./blackboard";
    import stage from "./stage";
    import zoomHelper from "./util/zoom_helper";

    let zoom = 100;
    blackboard.zoom.subscribe(x => zoom = Math.round(x));

    const defaultOptions = zoomHelper.defaultOptions;
    let zoomOptions = defaultOptions;
    $: {
        zoomOptions = [...defaultOptions];
        if (!zoomOptions.includes(zoom)) {
            zoomOptions.push(zoom);
            zoomOptions.sort((a, b) => a - b);
        }

        if(Math.round(blackboard.zoom.value) != zoom) {
            stage.zoomCenter(zoom);
        }
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