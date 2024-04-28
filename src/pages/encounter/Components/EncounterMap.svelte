<script lang="ts">
  import type { HexGrid } from "../hexGridMap/HexGrid";

  export let isMapSliderVisible: boolean;
  export let hexGridList: HexGrid[] = [];
  export let currentMap: number;
  export let canvasRoot: HTMLCanvasElement;

  function display(id: number) {
    hexGridList[currentMap].setDisplayed(false);

    currentMap = id;

    hexGridList[id].setDisplayed(true);
    hexGridList[id].redraw();
  }
</script>


<div class="map-slider" class:visible={isMapSliderVisible}>
  <div class="canvas-container">
    <canvas bind:this={canvasRoot}></canvas>
  </div>
  <div class="map-button-container">
    {#each hexGridList as hexGrid}
      <button class="btn btn-success" on:click={() => display(hexGridList.indexOf(hexGrid))}>
        {hexGrid.id}
      </button>
    {/each}
  </div>
</div>


<style>
  .map-slider {
    position: fixed;
    top: -100%;
    left: 0;
    width: 100%;
    height: calc(100vh - 75px - 63px);
    background: url('/assets/map.png');
    background-size: cover;
    color: #fff;
    transition: top 0.5s ease;
    overflow: hidden;
    z-index: 999;
    display: flex;
  }

  .map-slider.visible {
    top: 75px;
  }

  .canvas-container {
    flex: 1;
  }

  .map-button-container {
    display: flex;
    flex-direction: column;
  }

  .map-button-container button {
    margin: 5px;
  }
</style>