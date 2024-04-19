<script lang="ts">
  import { api } from "../../../lib/Exports";
  import { Notify, Loading } from "notiflix";
  import { deleteRequest, putRequest } from "../../../lib/Functions";

  import ScrollingText from "../../../lib/Components/ScrollingText.svelte";
  import ConfirmModal from "../../../lib/Components/ConfirmModal.svelte";

  export let adventureList: any;
  export let index: number;

  sessionStorage.setItem('adventureId', '0');

	let token = sessionStorage.getItem('token') || '';

  let showConfirmModal = false;

  function showModal() {
    showConfirmModal = true;
  }

  function handleEditAdventure() {
    Loading.dots('Loading...')
    const title = document.getElementById(`editTitle${index}`) as HTMLInputElement;
    const description = document.getElementById(`editDescription${index}`) as HTMLInputElement;

    const adventureCopy = adventureList[index];
    adventureCopy.title = title.value;
    adventureCopy.description = description.value;

    putRequest(`${api}/adventures/${adventureCopy.id}?token=${token}`, adventureCopy,
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

  function handleDeleteAdventure() {
    Loading.dots('Loading...')

    deleteRequest(`${api}/adventures/${adventureList[index].id}?token=${token}`,
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
</script>

<div class="col-xl-3 col-lg-4 col-md-6">
  <div class="card adventure-card border-0 m-3">
    <div class="card-header">
      <div class="d-flex justify-content-between">
        <div class="title-container" data-simplebar>
          <ScrollingText>
            <h5>{adventureList[index].title}</h5>
          </ScrollingText>
        </div>
        <button class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#editModal{index}">Edit</button>
      </div>
    </div>
    <div class="card-body adventure-description" data-simplebar>
      <p>{adventureList[index].description}</p>
    </div>
    <div class="card-body adventure-resources">
      <div class="row text-center align-items-center">
        <div class="col-4">
          <label for="reputation" class="">Reputation</label>
          <input type="text" class="resources-input form-control align-self-center" disabled value={adventureList[index].reputation} />
        </div>
        <div class="col-4">
          <label for="gold" class="">Gold</label>
          <input type="text" class="resources-input form-control align-self-center" disabled value={adventureList[index].gold} />
        </div>
        <div class="col-4">
          <label for="experience" class="">Experience</label>
          <input type="text" class="resources-input form-control align-self-center" disabled value={adventureList[index].experience} />
        </div>
      </div>
    </div>
    <div class="card-footer">
      <a class="btn btn-xl w-100 continue-button" href="/adventure" on:click={() => { sessionStorage.setItem('adventureId', adventureList[index].id.toString()) }}>Continue</a>
    </div>
  </div>
</div>
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
  .card {
    color: #bababa;
    border-radius: 5px;
    border: none;
    background-color: #222;
  }

  .card-header {
    color: #fff;
  }

  .title-container {
    overflow: hidden;
    white-space: nowrap;
    width: 85%;
  }

  .adventure-description {
    height: 20vh;
    background-color: #333;
  }

  .adventure-resources {
    border-top: 1px solid #1c1c1c;
    margin: 0;
    padding: 0 10px 0 10px;
  }

  .continue-button {
    color: #bababa;
    border-color: #4fc780;
    box-shadow: 0 0 0 0.5rem #222;
  }

  .continue-button:hover {
    color: #222;
    background-color: #4fc780;
  }

  .resources-input {
    max-width: 75px;
    background-color: #333;
    border-color: #1c1c1c;
    text-align: center;
    margin: 0 auto 10px auto;
  }

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