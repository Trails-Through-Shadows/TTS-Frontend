<script lang="ts">
  import { api, Character, Location } from "../../lib/Exports";
  import { Notify, Loading } from "notiflix";
  import { getRequest, postRequest, checkToken } from "../../lib/Functions";

  import Navbar from "../../lib/Components/Navbar.svelte";
  import LogoutButton from "../../lib/Components/LogoutButton.svelte";
  import AdventureCharacterCard from "./Components/AdventureCharacterCard.svelte";
  import Bottombar from "../../lib/Components/Bottombar.svelte";
  import AdventureSelectModal from "./Components/AdventureSelectModal.svelte";


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
  let encounterList: { id: number, idLocation: number, title: string, state: string }[] = [];

  let locationId = 0;
  let encounterId = 0;
  
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
          
          encounterList = data.map((encounter: any) => ({ id: encounter.id, idLocation: encounter.idLocation, title: '', state: encounter.state }));

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


<AdventureSelectModal {locationList} {encounterList} bind:locationId bind:encounterId />


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