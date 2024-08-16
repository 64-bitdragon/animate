<script lang="ts">
    import BottomPanel from "./BottomPanel.svelte";
    import Header from "./Header.svelte";
    import MenuBar from "./MenuBar.svelte";
    import RightPanel from "./RightPanel.svelte";
    import Stage from "./Stage.svelte";
    import Toolbox from "./Toolbox.svelte";
    import settings from "./settings";

    function startDraggingHorizontalTrack() {
        document.body.style.cursor = 's-resize';
        document.body.addEventListener('mousemove', recalculateBottomHeight);
        document.body.addEventListener('mouseup', stopDraggingHorizonalTrack);
    }

    function stopDraggingHorizonalTrack() {
        document.body.removeEventListener('mousemove', recalculateBottomHeight);
        document.body.removeEventListener('mouseup', stopDraggingHorizonalTrack);
        document.body.style.cursor = '';
        settings.save();
    }

    function recalculateRightWidth(e:MouseEvent) {
        settings.mainWindowRightWidth = document.body.clientWidth - e.clientX - 5;
    }

    function startDraggingVerticalTrack() {
        document.body.style.cursor = 'w-resize';
        document.body.addEventListener('mousemove', recalculateRightWidth);
        document.body.addEventListener('mouseup', stopDraggingVerticalTrack);
    }

    function stopDraggingVerticalTrack() {
        document.body.removeEventListener('mousemove', recalculateRightWidth);
        document.body.removeEventListener('mouseup', stopDraggingVerticalTrack);
        document.body.style.cursor = '';
        settings.save();
    }

    function recalculateBottomHeight(e:MouseEvent) {
        settings.mainWindowBottomHeight = document.body.clientHeight - e.clientY - 5;
    }
</script>
<main>                               
    <div id="menu">
        <MenuBar />
    </div>
    <div id="not_menu">
        <div id="toolbox">
            <Toolbox />
        </div>

        <div id="middle">
            <div id="breadcrumbs">
                <Header />
            </div>
            <div id="stage">
                <Stage />
            </div>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div id="horizontal_track" class="track" on:mousedown={startDraggingHorizontalTrack}></div>
            <div id="bottom" style="height: {settings.mainWindowBottomHeight}px">
                <BottomPanel />
            </div>
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div id="vertical_track" class="track" on:mousedown={startDraggingVerticalTrack}></div>
        <div id="right" style="width: {settings.mainWindowRightWidth}px">
            <RightPanel />
        </div>
    </div>
</main>

<style lang="scss">
    main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    #not_menu {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        min-height: 0;
    }

    #toolbox {
        width: fit-content;
        flex-grow: 0;
        flex-shrink: 0;
    }

    #middle {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        flex-shrink: 1;
    }

    #stage {
        flex-grow: 1;
        flex-shrink: 1;
        min-height: 0;
    }

    #bottom, #right {
        flex-grow: 0;
        flex-shrink: 0;
    }

    #horizontal_track {
        height: 5px;
        cursor:s-resize;
    }

    #vertical_track {
        width: 5px;
        cursor:w-resize;
    }

    .track {
        background-color: var(--track-color);
    }
</style>
