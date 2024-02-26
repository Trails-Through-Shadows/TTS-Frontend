<script lang="ts">
  import { api, Adventure, Campaign } from "../../lib/Exports";
  import { Login } from "./Login";
  import { Notify, Loading } from "notiflix";

  let idLicense = sessionStorage.getItem('idLicense') ? parseInt(sessionStorage.getItem('idLicense') as string) : 0;
  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';

  let licenseNumber = '';
  let password = '';

  let loggedIn = false;
  let adventureList: Adventure[] = [];
  let campaignList: Campaign[] = [];

  const creator = new Login();

  let selectedCampaign: Campaign | null = null;

  if (idLicense === 0 || token === '') {
    sessionStorage.clear();
  } else {
    logIn();
  }

  function logIn() {
    loggedIn = true;

    Loading.dots('Loading...')
    creator.readDataAdventures(`${api}/adventures/?token=${token}`,
      () => {
        adventureList = creator.getAdventures();
        Loading.remove();
      },
      (m: string) => {
        sessionStorage.clear();
        Loading.remove();
        Notify.failure(m)
        if (m === 'Invalid session token!') {
          loggedIn = false;
        }
      }
    );
    creator.readDataCampaigns(`${api}/campaigns`, () => campaignList = creator.getCampaigns(), (m: string) => Notify.failure(m));
  }

  function handleLogin() {
    creator.postDataLogin(`${api}/session/login`, licenseNumber, password, (id: number, t: string) => {
      idLicense = id;
      token = t;

      sessionStorage.setItem('idLicense', idLicense.toString());
      sessionStorage.setItem('token', token);

      logIn();
    },
    (m: string) => Notify.failure(m)
    );
  }

  function handleEditAdventure(index: number) {
    Loading.dots('Loading...')
    const title = document.getElementById(`editTitle${index}`) as HTMLInputElement;
    const description = document.getElementById(`editDescription${index}`) as HTMLInputElement;

    const adventureCopy = adventureList[index];
    adventureCopy.title = title.value;
    adventureCopy.description = description.value;

    creator.putDataEditAdventure(`${api}/adventures/${adventureCopy.id}?token=${token}`, adventureCopy, () => {
      adventureList[index] = adventureCopy;
      Loading.remove();
      Notify.success('Adventure edited successfully');
    },
    (m: string) => {
      Loading.remove();
      Notify.failure(m)
    }
    );
  }

  function handleDeleteAdventure(index: number) {
    creator.deleteDataAdventure(`${api}/adventures/${adventureList[index].id}?token=${token}`, () => {
      adventureList.splice(index, 1);
      adventureList = [...adventureList];
      Notify.success('Adventure deleted successfully');
    },
    (m: string) => Notify.failure(m)
    );
  }

  function handleCreateAdventure() {
    if (!selectedCampaign) {
      Notify.failure('Please select a campaign');
      return;
    }

    Loading.dots('Loading...')

    const title = document.getElementById('createTitle') as HTMLInputElement;
    const description = document.getElementById('createDescription') as HTMLInputElement;

    const newAdventure = new Adventure(null, title.value, description.value, 0, 0, 0, selectedCampaign.id);

    creator.postDataCreateAdventure(`${api}/adventures/${idLicense}?token=${token}`, newAdventure,
      (idAdventure: number) => {
        adventureList = [...adventureList, newAdventure];
        Loading.remove();
        Notify.success('Adventure created successfully');
        window.location.href = `/char?id=${idAdventure}`;
        
      },
      (response: any) => {
        Loading.remove();
        const titleErrors = response.errors.filter((error: any) => error.object === "Title");
        const descriptionErrors = response.errors.filter((error: any) => error.object === "Description");

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
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card adventure-card border-0 m-3">
            <div class="card-header">
              <div class="d-flex justify-content-between">
                <h5>{adventure.title}</h5>
                <button class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#editModal{index}">Edit</button>
              </div>
            </div>
            <div class="card-body adventure-description" data-simplebar>
              <p>{adventure.description}</p>
            </div>
            <div class="card-body adventure-resources">
              <div class="row text-center align-items-center">
                <div class="col-4">
                  <label for="reputation" class="">Reputation</label>
                  <input type="text" class="resources-input form-control align-self-center" disabled value={adventure.reputation} />
                </div>
                <div class="col-4">
                  <label for="gold" class="">Gold</label>
                  <input type="text" class="resources-input form-control" disabled value={adventure.gold} />
                </div>
                <div class="col-4">
                  <label for="experience" class="">Experience</label>
                  <input type="text" class="resources-input form-control" disabled value={adventure.experience} />
                </div>
              </div>
            </div>
            <div class="card-footer">
              <a class="btn btn-xl w-100 continue-button" href="/adventure?id={adventure.id}">Continue</a>
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
                <button type="button" class="btn btn-success" data-bs-dismiss="modal" on:click="{() => handleEditAdventure(index)}">Save</button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {#if adventureList.length < 8}
      <div class="col-xl-3 col-lg-4 col-md-6">
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
                  {#each campaignList as campaign}
                    <option value="{campaign}">{campaign.title}</option>
                  {/each}
                  <option value="{selectedCampaign}" selected disabled hidden>Select campaign</option>
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
              <button type="button" class="btn btn-success" on:click="{() => handleCreateAdventure()}">Create adventure</button>
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
    color: #bababa;
    border-radius: 5px;
    border: none;
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

  .login-card {
    width: 20vw;
    min-width: 250px;
  }

  .login-card .card-header {
    background-color: #222;
  }

  .login-card .card-body {
    background-color: #222;
  }

  .login-card .btn {
    color: #bababa;
    border-color: #4fc780;
  }

  .login-card .btn:hover {
    color: #222;
    background-color: #4fc780;
  }

  .adventure-card {
    background-color: #222;
  }

  .adventure-card .card-header {
    color: #fff;
  }

  .adventure-card .adventure-description {
    height: 20vh;
    background-color: #333;
  }

  .adventure-card .adventure-resources {
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

  .resources-input {
    width: 75px;
    background-color: #333;
    border-color: #1c1c1c;
    text-align: center;
    margin: 0 auto 10px auto;
  }

  .modal {
    color: #bababa;
  }

  .modal .modal-header {
    background-color: #222;
    color: #bababa;
    border-color: #1c1c1c;
  }

  .modal .modal-body {
    background-color: #222;
  }

  .modal .modal-footer {
    background-color: #222;
    border-color: #1c1c1c;
  }

  .form-select {
    background-color: #333;
    color: #bababa;
    border: none;
  }
</style>