<script lang="ts">
  import { api } from "../../../lib/Exports";
  import { getRequest } from "../../../lib/Functions";
  import { Notify } from "notiflix";

  export let selectedEffects: any;

  let effectList: effectType[] = [];
  let effectTargets: any = [];

  type effect = { type: string, strength: number, duration: number, description: string };
  type effectType = { title: string, displayTitle: string, description: string, hasDuration: boolean, hasStrength: boolean, isResistance: boolean, url: string };

  let isInteractionSliderVisible = true;
  let selectedEffect: effectType = { title: "", displayTitle: "", description: "", hasDuration: false, hasStrength: false, isResistance: false, url: "" };

  getRequest(`${api}/enum/effectType`, null,
    (data: any) => {
      effectList = data;
    },
    (data: any) => {
      Notify.failure(data.message);
    }
  );

  getRequest(`${api}/enum/effectTarget`, null,
    (data: any) => {
      effectTargets = data;
    },
    (data: any) => {
      Notify.failure(data.message);
    }
  );

  function toggleInteractionSlider() {
    isInteractionSliderVisible = !isInteractionSliderVisible;
  }

  function numpad(number: number) {
    let input = document.querySelector('.damage-input') as HTMLInputElement;
    if (number == -1) {
      input.value = input.value.slice(0, -1);
      return;
    }
    else if (number == -3) {
      input.value = "";
      selectedEffects = [];
      selectedEffects = selectedEffects;
      return;
    }
    input.value += number;
    input.value = input.value.slice(0, 3);
  }

  function handleAddEffect() {
    if (selectedEffect.title === "") {
      Notify.failure("Please select an effect.");
      return;
    }
    if (selectedEffect.hasStrength) {
      let strength = document.getElementById('effectStrength') as HTMLInputElement;
      if (strength.value === "") {
        Notify.failure("Please enter a strength value.");
        return;
      }
    }
    if (selectedEffect.hasDuration) {
      let duration = document.getElementById('effectDuration') as HTMLInputElement;
      if (duration.value === "") {
        Notify.failure("Please enter a duration value.");
        return;
      }
    }

    let strength = document.getElementById('effectStrength') as HTMLInputElement;
    let duration = document.getElementById('effectDuration') as HTMLInputElement;

    let effect: effect = {
      type: selectedEffect.title,
      strength: strength ? parseInt(strength.value) : 0,
      duration: duration ? parseInt(duration.value) : 0,
      description: selectedEffect.description
    };

    selectedEffects.push(effect);

    selectedEffects = selectedEffects;

    strength.value = "";
    duration.value = "";
  }

  function handleRemoveEffect(index: number) {
    selectedEffects.splice(index, 1);
    selectedEffects = selectedEffects;
  }
</script>


<div class="card bottom-slider interaction-slider" class:visible={isInteractionSliderVisible}>
  <button class="btn btn-success btn-toggle" on:click={toggleInteractionSlider}>
    <i class="bi" class:bi-chevron-compact-down={isInteractionSliderVisible} class:bi-chevron-compact-up={!isInteractionSliderVisible}></i>
  </button>
  <button class="btn card-header d-flex justify-content-center p-0" on:click={toggleInteractionSlider}>Interaction</button>
  <div class="card-body">
    <div class="draggable">
      <input type="number" class="btn btn-danger damage-input" placeholder="Damage" max="999" min="0" maxlength="3" on:input={(event) => event.target.value = event.target.value.slice(0, 3)} />
      <div class="row">
        {#each selectedEffects as effect, index}
          <div class="col">
            <button class="btn btn-danger" on:click={() => handleRemoveEffect(index)}>{index}</button>
          </div>
        {/each}
        {#if selectedEffects.length < 5}
          <div class="col">
            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#effectModal"><i class="bi bi-plus-lg"></i></button>
          </div>
        {/if}
      </div>
      <i class="bi bi-arrows-move moving-indicator"></i>
    </div>
    <div class="num-pad">
      {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as number}
        <button class="btn btn-lg btn-success" on:click={() => numpad(number)}>{number}</button>
      {/each}
      <button class="btn btn-lg btn-danger" on:click={() => numpad(-1)}><i class="bi bi-backspace"></i></button>
      <button class="btn btn-lg btn-success" on:click={() => numpad(0)}>0</button>
      <button class="btn btn-lg btn-danger" on:click={() => numpad(-3)}><i class="bi bi-arrow-repeat"></i></button>
    </div>
  </div>
</div>
<div class="modal fade" id="effectModal" tabindex="-1" aria-labelledby="effectModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="effectModalLabel">Effects</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="form-group mb-3">
          <label for="effectType">Type</label>
          <select class="form-select" id="effectType" bind:value={selectedEffect}>
            {#each effectList as effect}
              {#if effect.isResistance}
                <option value="{effect}">{effect.displayTitle} Resistance</option>
              {:else}
                <option value="{effect}">{effect.displayTitle}</option>
              {/if}
            {/each}
          </select>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-group">
              {#if selectedEffect.hasStrength}
                <label for="effectStrength">Strength</label>
                <input type="number" class="form-control" id="effectStrength" placeholder="Enter strength" max="999" min="0" maxlength="3" on:input={(event) => event.target.value = event.target.value.slice(0, 3)} />
              {:else}
                <label for="effectStrength">Strength</label>
                <input type="number" class="form-control" id="effectStrength" placeholder="No need" disabled />
              {/if}
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              {#if selectedEffect.hasDuration}
                <label for="effectDuration">Duration</label>
                <input type="number" class="form-control" id="effectDuration" placeholder="Enter duration" max="999" min="0" maxlength="3" on:input={(event) => event.target.value = event.target.value.slice(0, 3)} />
              {:else}
                <label for="effectDuration">Duration</label>
                <input type="number" class="form-control" id="effectDuration" placeholder="No need" disabled />
              {/if}
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer justify-content-right">
        <button type="button" class="btn btn-success" data-bs-dismiss="modal" on:click={handleAddEffect}>Add</button>
      </div>
    </div>
  </div>
</div>

<style>
.bottom-slider {
    position: fixed;
    bottom: calc(-40% + 44px + 63px);
    height: calc(40% + 30px);
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

  .interaction-slider {
    right: 5%;
    width: 250px;
    max-width: 100%;
  }

  .draggable {
    cursor: grab !important;
    border: 2px solid #c23737;
    border-radius: 5px;
    background-color: #333;
    margin: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .draggable * {
    cursor: grab !important;
  }

  .draggable:active, .draggable *:active {
    cursor: grabbing !important;
  }

  .draggable:active, .draggable *:active {
    cursor: grabbing !important;
  }

  .draggable input {
    width: 100%;
    height: 50px;
    background-color: #333;
    color: #bababa;
    text-align: center;
    justify-content: center;
    border: none;
    border-bottom: #222 1px solid;
    border-radius: 5px 5px 0 0;
    font-size: 1.5rem;
    padding: 0;
  }

  .draggable input[type="number"]::-webkit-outer-spin-button, .draggable input[type="number"]::-webkit-inner-spin-button, .draggable input[type="number"] {
    -webkit-appearance: none;
    margin: 0;
  }

  .draggable .col {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  .draggable button {
    width: 35px;
    height: 35px;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
  }

  .moving-indicator {
    position: absolute;
    top: 0;
    right: 5px;
    color: #757575;
    font-size: 1.25rem;
  }

  .num-pad {
    display: flex;
    flex-wrap: wrap;
    width: 156px;
    margin: 0 auto;
  }

  .num-pad .btn {
    margin: 1px;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content{
    color: #bababa;
    background-color: #222;
  }

  .modal-content > div {
    border-color: #1c1c1c;
  }

  .modal-dialog {
    max-width: 325px;
  }

  .modal .form-control {
    height: 2rem;
    background-color: #333;
    color: #bababa;
    border: none;
  }

  .modal .form-control::placeholder {
    color: #757575;
  }

  .modal .form-select {
    height: 2rem;
    background-color: #333;
    color: #bababa;
    border: none;
  }

  .modal .form-select option {
    background-color: #333;
    color: #bababa;
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

  h5 {
    color: white;
  }
</style>