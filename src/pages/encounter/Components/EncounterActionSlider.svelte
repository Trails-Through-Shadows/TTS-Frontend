<script lang="ts">
  export let isActionSliderVisible: boolean;

  function toggleActionSlider() {
    isActionSliderVisible = !isActionSliderVisible;
  }
</script>


<div class="card bottom-slider action-slider" class:visible={isActionSliderVisible}>
  <button class="btn btn-success btn-toggle" on:click={toggleActionSlider}>
    <i class="bi" class:bi-chevron-compact-down={isActionSliderVisible} class:bi-chevron-compact-up={!isActionSliderVisible}></i>
  </button>
  <button class="btn card-header d-flex justify-content-center p-0" on:click={toggleActionSlider}>Enemy Actions</button>
  <div class="card-body">
    <!--TODO-->
  </div>
</div>


<style>
  .bottom-slider {
    position: fixed;
    bottom: calc(-40% + 43px);
    height: calc(40% + 30px);
    transform: translateX(-50%);
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
    left: 50%;
    width: 500px;
  }

  .card-body {
    padding: 8px;
  }

  .card-header {
    background-color: #222;
    color: #bababa;
  }

  .card-body {
    background-color: #222;
    border-radius: 0 0 5px 5px;
  }
</style>