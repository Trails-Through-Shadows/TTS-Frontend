<script lang="ts">
  import './Encounter.css'

  import { Canvas } from '../../lib/hexGridMap/Canvas';
  import { HexGrid } from '../../lib/hexGridMap/HexGrid';
  import { onMount } from 'svelte';

  let canvasRoot: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRoot) {
      return;
    }

    const canvas = new Canvas(canvasRoot, undefined);

    const textureImage = new Image();
    textureImage.src = '/assets/map-texture-smol-light.jpg';

    const borderImage = new Image();
    borderImage.src = '/assets/map-texture-smol.jpg';

    const hexGrid = new HexGrid(canvas, 45, []);
    hexGrid.readData('https://api.tts-game.fun/parts/3', textureImage, borderImage);

    canvas.setBackgroundImage('/assets/map-background.jpg', () => {
        canvas.clear();
        hexGrid.draw();
    });

    canvas.addOnSizeListener(() => {
        canvas.clear();
        hexGrid.draw();
    });
  });

  let isSliderVisible = false;

  function toggleSlider() {
    isSliderVisible = !isSliderVisible;
  }
</script>

<main>
  <div>
    <nav class="navbar">
      <div class="logo-container">
        <img src="assets/logo-icon-small.png" alt="Logo" class="logo-icon" />
        <div class="logo">Trails Through Shadows</div>
      </div>
      <button class="navbar-button" on:click={toggleSlider}>Map</button>
      <div class="dropdown">
        <button class="navbar-button">Menu</button>
        <div class="dropdown-content">
          <a href="/">Login</a>
          <a href="/char">Character</a>
        </div>
      </div>
    </nav>

    <div class="slider" class:visible={isSliderVisible}>
      <canvas bind:this={canvasRoot}></canvas>
    </div>
  </div>
</main>