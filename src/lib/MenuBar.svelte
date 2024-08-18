<script lang="ts">
    import blackboard from './blackboard';
    import stage from './stage';
    import zoomHelepr from './util/zoom_helper';

    let menuBar: HTMLElement;

    let items = ["File", "View"];
    let currentlyOpen: string | null = null;

    function hoverMenu(e: MouseEvent, menuItem: string) {
        if (!currentlyOpen) {
            return;
        }

        openMenu(e.currentTarget as HTMLElement, menuItem);
    }

    function clickMenu(e: MouseEvent, menuItem: string) {
        e.stopImmediatePropagation();

        if (currentlyOpen) {
            // user clicked a menu button while the menu was open
            closeMenu();
            return;
        }

        document.body.addEventListener("click", closeMenu);
        openMenu(e.currentTarget as HTMLElement, menuItem);
    }

    function openMenu(menuButton: HTMLElement, menuItem: string) {
        currentlyOpen = menuItem;
        let currentlyOpenElement = menuBar.querySelector(
            "#" + menuItem.toLowerCase(),
        )! as HTMLElement;

        currentlyOpenElement.style.top =
            menuButton.offsetTop + menuButton.offsetHeight + 5 + "px";
        currentlyOpenElement.style.left = menuButton.offsetLeft + "px";
    }

    function closeMenu() {
        currentlyOpen = null;
        document.body.removeEventListener("click", closeMenu);
    }

    function zoomIn() {
        stage.zoomCenter(zoomHelepr.getNextZoomInValue(blackboard.zoom.value));
    }

    function zoomOut() {
        stage.zoomCenter(zoomHelepr.getNextZoomOutValue(blackboard.zoom.value));
    }

    function resetZoom() {
        stage.zoomCenter(100);
    }
</script>

<menuBar bind:this={menuBar}>
    {#each items as item}
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <button
            on:click={(e) => clickMenu(e, item)}
            on:mouseover={(e) => hoverMenu(e, item)}
            class:open_button={item == currentlyOpen}>{item}</button
        >
    {/each}

    <div
        id="file"
        class="item_container"
        class:open_container={currentlyOpen == "File"}
    ></div>
    <div
        id="view"
        class="item_container"
        class:open_container={currentlyOpen == "View"}
    >
        <button on:click={zoomIn}>Zoom In</button>
        <button on:click={zoomOut}>Zoom Out</button>
        <button on:click={resetZoom}>Reset Zoom</button>
    </div>
</menuBar>

<style lang="scss">
    menuBar {
        display: flex;
        flex-direction: row;
        gap: 5px;
        padding: 2px;
        padding-bottom: 5px;
        position: relative;

        & > button {
        }
    }

    .open_button {
        background-color: #555;
    }

    .open_container {
        display: flex !important;
    }

    .item_container {
        display: none;
        position: absolute;
        border: 1px solid #aaa;
        flex-direction: column;

        & > button {
            width: 100%;
            text-align: left;
            padding: 5px 8px;
        }
    }

    button {
        color: white;
        border: none;
        background-color: var(--background-color);
        &:hover {
            background-color: #555;
        }
    }
</style>
