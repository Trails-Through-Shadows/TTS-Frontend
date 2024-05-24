<script lang="ts">
  export let isActionSliderVisible: boolean;
  export let action: any;

  function toggleActionSlider() {
    isActionSliderVisible = !isActionSliderVisible;
  }

</script>

<div
  class="card bottom-slider action-slider"
  class:visible={isActionSliderVisible}
>
  <button class="btn btn-success btn-toggle" on:click={toggleActionSlider}>
    <i
      class="bi"
      class:bi-chevron-compact-down={isActionSliderVisible}
      class:bi-chevron-compact-up={!isActionSliderVisible}
    ></i>
  </button>
  <button
    class="btn card-header d-flex justify-content-center p-0"
    on:click={toggleActionSlider}>Enemy Actions</button
  >
  
  <div class="card-body">
    <div class="card-holder" id="cardHolder" />
  </div>

</div>

<style>
  .bottom-slider {
    position: fixed;
    bottom: -544px;
    height: 681px;
    transition: bottom 0.5s ease;
    z-index: 998;
    border: 0;
    background: 0;
  }

  .bottom-slider .btn-toggle {
    margin: 0 auto;
    height: 30px;
    width: 50px;
    border-radius: 5px 5px 0 0;
    border-bottom: 0;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bottom-slider .card-header {
    border-radius: 5px 5px 0 0;
    color: #bababa;
    font-size: 1.75rem;
  }

  .bottom-slider.visible {
    bottom: 0;
  }

  .bottom-slider .card-body {
    border-radius: 0;
  }

  .action-slider {
    right: 5px;
    width: 394px;
    max-width: 100%;
  }

  .card-header {
    background-color: #222;
    color: #bababa;
  }

  .card-body {
    background-color: #333;
    color: #bababa;
    border-radius: 0 0 5px 5px;
    padding: 8px;
  }

  .card-holder {
    scale: .6;
    transform-origin: 0;
    -webkit-transform-origin-y: top;
    -webkit-transform-origin-x: left;
  }

  @media (max-width: 659px)
  {
    .bottom-slider {
      bottom: -588px;
    }
  }
</style>
