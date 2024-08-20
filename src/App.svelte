<script lang="ts">
    import CommandPalette from "./lib/CommandPalette.svelte";
  import MainWindow from "./lib/MainWindow.svelte";
  import "tippy.js/dist/tippy.css";

  window.oncontextmenu = function () {
    return false; // cancel default menu
  };
</script>

<app>
  <CommandPalette />
  <MainWindow />
</app>

<style lang="scss">
  app {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
