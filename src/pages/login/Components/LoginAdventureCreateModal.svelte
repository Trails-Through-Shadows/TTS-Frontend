<script lang="ts">
  import { Notify, Loading } from "notiflix";
  import { Adventure, Campaign, api } from "../../../lib/Exports";
  import { postRequest } from "../../../lib/Functions";

  export let campaignList: any;
  export let adventureList: any;

  let selectedCampaign: Campaign | null = null;

  let licenseId = sessionStorage.getItem('licenseId') ? parseInt(sessionStorage.getItem('licenseId') as string) : 0;
  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
  
  function handleCreateAdventure() {
    if (!selectedCampaign) {
      Notify.failure('Please select a campaign');
      return;
    }

    Loading.dots('Loading...')

    const title = document.getElementById('createTitle') as HTMLInputElement;
    const description = document.getElementById('createDescription') as HTMLInputElement;

    const newAdventure = new Adventure(null, title.value, description.value, 0, 0, 0, selectedCampaign.id);

    postRequest(`${api}/adventures/${licenseId}`, token, newAdventure,
      (data: any) => {
        adventureList = [...adventureList, new Adventure(data.id, data.title, data.description, data.reputation, data.experience, data.gold, data.idCampaign)];
        sessionStorage.setItem('adventureId', data.id.toString());
        Loading.remove();
        Notify.success('Adventure created successfully');
        window.location.href = `/characters`;
      },
      (data: any) => {
        Loading.remove();
        const titleErrors = data.errors.filter((error: any) => error.object === "Title");
        const descriptionErrors = data.errors.filter((error: any) => error.object === "Description");

        if (titleErrors.length > 0) {
          titleErrors.forEach((titleError: any) => {
            titleError.errors.forEach((innerError: any) => {
              Notify.failure(innerError.message);
            });
          });
        }

        if (descriptionErrors.length > 0) {
          descriptionErrors.forEach((descriptionError: any) => {
            descriptionError.errors.forEach((innerError: any) => {
              Notify.failure(innerError.message);
            });
          });
        }
      }
    );
  }
</script>

<div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createModalLabel">New Adventure</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="form-group mb-3">
          <label for="createTitle">Title</label>
          <input type="text" class="form-control" id="createTitle" placeholder="Enter title" />
        </div>
        <div class="form-group">
          <div class="textarea-container">
            <label for="createDescription">Description</label>
            <textarea class="form-control no-resize" id="createDescription" placeholder="Enter description" />
          </div>
        </div>
        <div class="form-group mt-3">
          <label for="campaignSelect">Campaign</label>
          <select class="form-select" id="campaignSelect" bind:value="{selectedCampaign}">
            {#each campaignList as campaign}
              <option value="{campaign}">{campaign.title}</option>
            {/each}
            <option value="{selectedCampaign}" selected disabled hidden>Select campaign</option>
          </select>
        </div>
        <div class="container">
          {#if selectedCampaign}
            <p>{selectedCampaign.description}</p>
          {/if}
        </div>
      </div>
      <div class="modal-footer justify-content-right">
        <button type="button" class="btn btn-success" on:click="{() => handleCreateAdventure()}">Create adventure</button>
      </div>
    </div>
  </div>
</div>


<style>
  .form-control {
    height: 2rem;
    background-color: #333;
    color: #bababa;
    border: none;
  }

  .form-control::placeholder {
    color: #757575;
  }

  .textarea-container {
    height: 25vh;
  }

  .textarea-container textarea {
    height: 90%;
    resize: none;
  }

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
</style>