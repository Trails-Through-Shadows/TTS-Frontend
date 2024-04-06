<script lang="ts">
  export let isMapSliderVisible: boolean;
  export let hexGridList: any;
  export let currentMap: number;
  export let canvasRoot: HTMLCanvasElement;

  function draw(id: number) {
    for (let hexGrid of hexGridList) {
      hexGrid.displayed = false;
    }
    currentMap = id;
    hexGridList[id].displayed = true;
    hexGridList[id].redraw();
  }
</script>


<div class="map-slider" class:visible={isMapSliderVisible}>
  <div class="canvas-container">
    <canvas bind:this={canvasRoot}></canvas>
  </div>
  <div class="map-button-container">
    {#each hexGridList as hexGrid}
      <button class="btn btn-success" on:click={() => draw(hexGridList.indexOf(hexGrid))}>
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
    height: 100%;
    background: url('/assets/map.png');
    background-size: cover;
    color: #fff;
    transition: top 0.5s ease;
    overflow: hidden;
    z-index: 999;
    display: flex;
  }

  .map-slider.visible {
    top: 0;
  }

  .canvas-container {
    flex: 1;
  }

  .map-button-container {
    padding-top: 75px;
    display: flex;
    flex-direction: column;
  }

  .map-button-container button {
    margin: 5px;
  }
</style>