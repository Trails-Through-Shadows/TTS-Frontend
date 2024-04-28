<script lang="ts">
  import { api, Character, Location } from "../../lib/Exports";
  import { Notify, Loading } from "notiflix";
  import { getRequest, postRequest, checkToken } from "../../lib/Functions";

  import Navbar from "../../lib/Components/Navbar.svelte";
  import LogoutButton from "../../lib/Components/LogoutButton.svelte";
  import AdventureCharacterCard from "./Components/AdventureCharacterCard.svelte";
  import Bottombar from "../../lib/Components/Bottombar.svelte";


  Notify.init({
    clickToClose: true
  });

  
  let licenseId = sessionStorage.getItem('licenseId') ? parseInt(sessionStorage.getItem('licenseId') as string) : 0;
  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
  let adventureId = sessionStorage.getItem('adventureId') ? parseInt(sessionStorage.getItem('adventureId') as string) : 0;
  
  if (licenseId === 0 || token === '') {
    sessionStorage.clear();
    window.location.href = "/";
  }

  Loading.dots('Loading characters...');

  if (adventureId === 0) {
    Notify.failure('Something went wrong.');
  }

  let characterList: Character[] = [];
  let locationList: Location[] = [];
  let encounterList: { id: number, idLocation: number, title: string }[] = [];

  function handleStartEncounter() {
  Loading.dots('Loading encounter...');

  let locationId = (document.getElementById('startEncounterSelect') as HTMLSelectElement).value;

  if ((document.getElementById('startTab') as HTMLSelectElement).classList.contains('active')) {
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
    let encounterId = (document.getElementById('continueEncounterSelect') as HTMLSelectElement).value;

    window.location.href = `/encounter?id=${encounterId}`;
  }
}
  
  getRequest(`${api}/adventures/${adventureId}?lazy=false`, token,
    (data: any) => {
      characterList = data.characters.map((character: any) => new Character(character.id, character.clazz, character.race, character.title, character.playerName, character.url));
      locationList = data.campaign.locations.map((location: any) => new Location(location.location.id, location.location.title, location.location.tag, location.location.type, location.location.description));

      if (characterList.length === 0) {
        Loading.remove();
        Notify.failure('No characters found.');
        window.location.href = `/characters`;
      }

      getRequest(`${api}/encounters?idAdventure=${adventureId}`, token,
        (data: any) => {
          data = data.object;
          
          encounterList = data.map((encounter: any) => ({ id: encounter.id, idLocation: encounter.idLocation }));

          for (let i = 0; i < encounterList.length; i++) {
            encounterList[i].title = locationList.find(location => location.id === encounterList[i].idLocation)?.title as string;
          }

          Loading.remove();
        },
        (data: any) => {
          Notify.failure(data.message);
          checkToken(data.message);
        }
      );
    },
    (data: any) => {
      Notify.failure(data.message);
      Loading.remove();
      checkToken(data.message);
    }
  );
</script>


<Navbar title="Adventure">
  <LogoutButton />
</Navbar>


<main data-simplebar>
  <div class="container-fluid">
    <div class="row">
      {#each characterList as character, index}
        <AdventureCharacterCard bind:characterList={characterList} index={index} />
      {/each}
    </div>
  </div>
</main>

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
            <h5>Start a new encounter</h5>
            <select class="form-select" id="startEncounterSelect">
              {#each locationList as location}
                <option value="{location.id}">{location.title}</option>
              {/each}
            </select>
          </div>
          <div class="tab-pane fade" id="continueEncounter" role="tabpanel" aria-labelledby="continueTab">
            {#if encounterList.length !== 0}
              <h5>Continue an encounter</h5>
              <select class="form-select" id="continueEncounterSelect">
                {#each encounterList as location}
                  <option value="{location.id}">{location.title}</option>
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


<Bottombar>
  <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#encounterModal">Start encounter</button>
</Bottombar>


<!--
The Forgotten Doll
Once there was a small town nestled deep within a forest, its name whispered only in hushed tones by those who dared speak of it. The townsfolk had long abandoned their homes, leaving behind memories tainted with fear and despair. Yet, one house stood untouched by time, its windows like hollow eyes peering into the darkness. Legend had it that the house belonged to the Wickershams, a family cursed by tragedy. It was said that on a moonless night, the youngest daughter, Emily, vanished without a trace. Her disappearance left the family broken, and the house became a monument to their grief. Years passed, and the house remained untouched until a young couple, Sarah and David, stumbled upon it during a weekend getaway. Ignoring the warnings of locals, they ventured inside, their footsteps echoing through the empty halls. In a forgotten corner of the attic, Sarah discovered a dusty old doll tucked away amidst a pile of forgotten toys. Its porcelain face was cracked, its once vibrant dress faded with time.

Continuation
Intrigued, Sarah brushed off the cobwebs and held the doll in her hands. That night, as Sarah and David slept, strange noises echoed through the house. Sarah awoke to find the doll sitting at the foot of their bed, its eyes now gleaming with an otherworldly light. Frozen in fear, she watched as the doll's porcelain lips twisted into a sinister smile. With each passing hour, the doll grew more sinister, its presence suffocating. David tried to rid the house of the cursed doll, but it always found its way back, lurking in the shadows, its gaze filled with malice. As the days turned into weeks, Sarah and David's sanity began to unravel. Whispers filled their dreams, urging them to join the forgotten souls trapped within the house's walls.

Continuation 2
Desperate for escape, they tried to flee, but the forest seemed to stretch on endlessly, trapping them within its grasp. In the end, Sarah and David became just another chapter in the town's dark history, their fate sealed by the cursed doll they had dared to disturb. And as the years passed, the house faded into legend once more, its secrets buried beneath layers of forgotten time. But deep within its walls, the doll still waits, patiently biding its time for the next unsuspecting soul to wander into its grasp.
-->

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