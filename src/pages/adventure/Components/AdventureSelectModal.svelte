<script lang="ts">
  import { api } from "../../../lib/Exports";
  import { Notify, Loading } from "notiflix";
  import { postRequest, checkToken } from "../../../lib/Functions";
  
  
  export let locationList: { id: number, title: string }[] = [];
  export let encounterList: { id: number, idLocation: number, title: string, state: string }[] = [];
  export let locationId: number;
  export let encounterId: number;

  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
  let adventureId = sessionStorage.getItem('adventureId') ? parseInt(sessionStorage.getItem('adventureId') as string) : 0;

  function handleStartEncounter() {
    if ((document.getElementById('startTab') as HTMLSelectElement).classList.contains('active')) {

      if (locationId === 0) {
        Notify.failure('Please select a location.');
        return;
      }

      Loading.dots('Loading encounter...');

      postRequest(`${api}/encounters/${adventureId}?idLocation=${locationId}`, token, {},
        (data: any) => {
          Loading.remove();
          window.location.href = `/encounter?id=${data.id}`;
        },
        (data: any) => {
          Loading.remove();
          Notify.failure(data.message);
          checkToken(data.message);
        }
      );
    } else if ((document.getElementById('continueTab') as HTMLSelectElement).classList.contains('active')) {
      
      if (encounterId === 0) {
        Notify.failure('Please select an encounter.');
        return;
      }

      window.location.href = `/encounter?id=${encounterId}`;
    }
  }
</script>


<div class="modal fade" id="encounterModal" tabindex="-1" aria-labelledby="encounterModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="encounterModalLabel">Encounters</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <ul class="nav nav-tabs" id="encounterTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="startTab" data-bs-toggle="tab" data-bs-target="#startEncounter" type="button" role="tab" aria-controls="startEncounter" aria-selected="true">Start New Encounter</button>
          </li>
          {#if encounterList.length !== 0}
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="continueTab" data-bs-toggle="tab" data-bs-target="#continueEncounter" type="button" role="tab" aria-controls="continueEncounter" aria-selected="false">Continue Encounter</button>
            </li>
          {:else}
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="continueTab" data-bs-toggle="tab" data-bs-target="#continueEncounter" type="button" role="tab" aria-controls="continueEncounter" aria-selected="false" disabled>Continue Encounter</button>
            </li>
          {/if}
        </ul>
        <div class="tab-content" id="encounterTabContent">
          <div class="tab-pane fade show active" id="startEncounter" role="tabpanel" aria-labelledby="startTab">
            <h5 class="mt-3">Start a new encounter</h5>
            <select class="form-select" id="startEncounterSelect" bind:value={locationId}>
              <option value="{0}" disabled hidden>Select a location</option>
              {#each locationList as location}
                <option value="{location.id}">{location.title}</option>
              {/each}
            </select>
          </div>
          <div class="tab-pane fade" id="continueEncounter" role="tabpanel" aria-labelledby="continueTab">
            {#if encounterList.length !== 0}
              <h5 class="mt-3">Continue an encounter</h5>
              <select class="form-select" id="continueEncounterSelect" bind:value={encounterId} style="color: {encounterId === 0 ? '#bababa' : encounterList.find(encounter => encounter.id === encounterId)?.state === 'FAILED' ? '#c23737' : encounterList.find(encounter => encounter.id === encounterId)?.state === 'COMPLETED' ? '#4fc780' : '#bababa'}">
                <option value="{0}" disabled hidden>Select an encounter</option>
                {#each encounterList as encounter}
                  <option value="{encounter.id}" style="color: {encounter.state === 'FAILED' ? '#c23737' : encounter.state === 'COMPLETED' ? '#4fc780' : '#bababa'}">{encounter.title}</option>
                {/each}
              </select>
            {/if}
          </div>
        </div>
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-success" data-bs-dismiss="modal" on:click={() => handleStartEncounter()}>Start</button>
      </div>
    </div>
  </div>
</div>


<style>
  .modal-content{
    color: #bababa;
    background-color: #222;
  }

  .modal-content > div {
    border-color: #1c1c1c;
  }

  .form-select {
    background-color: #333;
    color: #bababa;
    border: none;
  }

  .nav-link {
    border-color: #4fc780;
    color: #bababa;
  }

  .nav-link:hover {
    border-color: #4fc780;
    background-color: #4fc780;
    color: #222;
  }

  .nav-link:disabled {
    border-color: #333;
    color: #555;
  }

  .nav-link.active {
    background-color: #4fc780;
    color: #222;
  }
</style>