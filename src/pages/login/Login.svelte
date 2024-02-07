<script lang="ts">
  import { api, Adventure, Campaign } from "../../lib/Exports";
  import { AdventureList, CampaignList } from "./Login";

  let licenseNumber = '';
  let password = '';

  let loggedIn = false;
  let adventureList: Adventure[] = [];
  let campaignList: Campaign[] = [];

  const creatorAdv = new AdventureList();
  creatorAdv.readData(`${api}/playerdata/adventures`, () => adventureList = creatorAdv.getAdventures());

  const creatorCamp = new CampaignList();
  creatorCamp.readData(`${api}/campaigns`, () => campaignList = creatorCamp.getCampaigns());

  let selectedCampaign: Campaign | null= null;

  function handleLogin() {
    if (licenseNumber === '0000' && password === 'admin') {
      loggedIn = true;
    } else {
      alert('Login failed!');
    }
  }

  function handleDeleteAdventure(index: number) {
    // TODO: Delete adventure
  }

  function handleSaveChanges(index: number) {
    const title = document.getElementById(`editTitle${index}`) as HTMLInputElement;
    const description = document.getElementById(`editDescription${index}`) as HTMLInputElement;

    adventureList[index].title = title.value;
    adventureList[index].description = description.value;
  }

  function handleCreateAdventure() {
    // TODO: Create adventure
  }
</script>


<nav class="navbar">
  <div class="logo-container">
    <img src="assets/logo-icon-small.png" alt="Logo" />
    Trails Through Shadows
  </div>
  <div class="dropdown">
    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      Temporary link menu
    </button>
  
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="/">Login</a></li>
      <li><a class="dropdown-item" href="/encounter">Encounter</a></li>
      <li><a class="dropdown-item" href="/char">Characters</a></li>
    </ul>
  </div>
</nav>


<main>
  {#if !loggedIn}
    <div class="container d-flex align-items-center justify-content-center">
      <div class="card login-card">
        <div class="card-header text-center border-0">
          <h5 class="card-title"><b>Login</b></h5>
        </div>
        <div class="card-body">
          <form>
            <div class="form-group">
              <label for="licenseNumber">License Number</label>
              <input type="text" class="form-control" id="licenseNumber" placeholder="ABCD-0123-EFGH-4567" bind:value="{licenseNumber}">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control" id="password" placeholder="password" bind:value="{password}">
            </div>
            <button type="button" class="btn btn-sm col-12 mt-3" on:click="{handleLogin}">Login</button>
          </form>
        </div>
      </div>
    </div>
  {:else}
    <div class="row w-100">
      {#each adventureList as adventure, index}
        <div class="col-xl-3">
          <div class="card adventure-card border-0 m-3">
            <div class="card-header">
              <div class="d-flex justify-content-between">
                <h5>{adventure.title}</h5>
                <button class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#editModal{index}">Edit</button>
              </div>
            </div>
            <div class="card-body adventure-description">
              <p>{adventure.description}</p>
            </div>
            <div class="card-body adventure-resources d-flex justify-content-between">
              <p>Reputation: {adventure.reputation}</p>
              <p>Experience: {adventure.experience}</p>
              <p>Gold: {adventure.gold}</p>
            </div>
            <div class="card-footer">
              <a class="btn btn-sm w-100" href="/encounter">Continue</a>
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
                  <input type="text" class="form-control" id="editTitle{index}" placeholder="Enter title" value="{adventure.title}" />
                </div>
                <div class="form-group textarea-container">
                  <label for="editDescription{index}">Description</label>
                  <textarea class="form-control no-resize" id="editDescription{index}" placeholder="Enter description" value="{adventure.description}" />
                </div>
              </div>
              <div class="modal-footer justify-content-between">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" on:click={() => handleDeleteAdventure(index)}>Delete</button>
                <button type="button" class="btn btn-success" data-bs-dismiss="modal" on:click="{() => handleSaveChanges(index)}">Save</button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {#if adventureList.length < 8}
      <div class="col-xl-3">
        <div class="small-card-container">
          <button class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#createModal">
            <img class="scroll-image" src="assets/scroll.png" alt="Add adventure" />
          </button>
        </div>
      </div>
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
                  <option selected disabled hidden>Select campaign</option>
                  {#each campaignList as campaign}
                    <option value="{campaign}">{campaign.title}</option>
                  {/each}
                </select>
              </div>
              <div class="container-fluid">
                {#if selectedCampaign}
                  <p>{selectedCampaign.description}</p>
                {/if}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-success" data-bs-dismiss="modal" on:click="{() => handleCreateAdventure()}">Create adventure</button>
            </div>
          </div>
        </div>
      </div>
    {/if}
    </div>
  {/if}
</main>

<style>
  .card {
    border-radius: 5px;
  }

  .form-control {
    border-radius: 3px;
    height: 2rem;
  }

  .login-card {
    width: 20vw;
  }

  .login-card .card-header {
    background-color: #f0f0f0;
  }

  .login-card .card-body {
    background-color: #f0f0f0;
  }

  .login-card .btn {
    border-radius: 3px;
  }

  .adventure-card {
    height: 35vh;
  }

  .adventure-card .card-header {
    background-color: #222;
    color: #fff;
  }

  .adventure-card .adventure-description {
    background-color: #bababa;
    height: 20vh;
    overflow: auto;
  }

  .adventure-card .adventure-resources {
    background-color: #f0f0f0;
    margin: 0;
    padding: 0 10px 0 10px;
  }

  .small-card-container {
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scroll-image {
    width: 120px;
  }

  .textarea-container {
    height: 25vh;
  }

  .textarea-container textarea {
    height: 90%;
    resize: none;
  }
</style>