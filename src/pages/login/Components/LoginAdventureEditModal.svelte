<script lang="ts">
  import { api } from "../../../lib/Exports";
  import { putRequest, deleteRequest } from "../../../lib/Functions";
  import { Notify, Loading } from "notiflix";
  import ConfirmModal from "../../../lib/Components/ConfirmModal.svelte";

  export let adventureList: any;
  export let index: number;

  let showConfirmModal = false;

  function showModal() {
    showConfirmModal = true;
  }

  let token = sessionStorage.getItem('token') || '';

  function handleDeleteAdventure() {
    Loading.dots('Loading...')

    deleteRequest(`${api}/adventures/${adventureList[index].id}`, token,
      () => {
        adventureList.splice(index, 1);
        adventureList = [...adventureList];
        Loading.remove();
        Notify.success('Adventure deleted successfully');
      },
      (data: any) => {
        Loading.remove();
        Notify.failure(data.message)
      }
    );
  }

  function handleEditAdventure() {
    Loading.dots('Loading...')
    const title = document.getElementById(`editTitle${index}`) as HTMLInputElement;
    const description = document.getElementById(`editDescription${index}`) as HTMLInputElement;

    const adventureCopy = adventureList[index];
    adventureCopy.title = title.value;
    adventureCopy.description = description.value;

    putRequest(`${api}/adventures/${adventureCopy.id}`, token, adventureCopy,
      () => {
        adventureList[index] = adventureCopy;
        Loading.remove();
        Notify.success('Adventure edited successfully');
      },
      (data: any) => {
        Loading.remove();
        Notify.failure(data.message)
      }
    );
  }
</script>


<div class="modal fade" id="editModal{index}" tabindex="-1" aria-labelledby="editModalLabel{index}" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editModalLabel{index}">Edit Adventure</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="form-group mb-3">
          <label for="editTitle{index}">Title</label>
          <input type="text" class="form-control" id="editTitle{index}" placeholder="Enter title" value="{adventureList[index].title}" />
        </div>
        <div class="form-group textarea-container">
          <label for="editDescription{index}">Description</label>
          <textarea class="form-control no-resize" id="editDescription{index}" placeholder="Enter description" value="{adventureList[index].description}" />
        </div>
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" on:click={() => showModal()}>Delete</button>
        <button type="button" class="btn btn-success" data-bs-dismiss="modal" on:click={() => handleEditAdventure()}>Save</button>
      </div>
    </div>
  </div>
</div>

<ConfirmModal title="Delete Adventure" body="Are you sure you want to delete this adventure?" buttonText="Delete" onConfirm={handleDeleteAdventure} bind:showConfirmModal={showConfirmModal} />


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
</style>