<script lang="ts">
  import { Character, Clazz, Race } from '../../lib/Exports';
  import { api, checkToken } from '../../lib/Exports';
  import { Notify, Loading } from 'notiflix';
  import { getRequest, postRequest } from '../../lib/Functions';

  import Navbar from '../../lib/Components/Navbar.svelte';
  import LogoutButton from '../../lib/Components/LogoutButton.svelte';
  import CharacterCreationCard from './Components/CharacterCreationCard.svelte';
  import CharacterCreationAdd from './Components/CharacterCreationAdd.svelte';

  Notify.init({
    clickToClose: true
  });

  let licenseId = sessionStorage.getItem('licenseId') ? parseInt(sessionStorage.getItem('licenseId') as string) : 0;
  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
  
  if (licenseId === 0 || token === '') {
    sessionStorage.clear();
    window.location.href = "/";
  }

  const urlParams = new URLSearchParams(window.location.search);
  let idAdventure = urlParams.get('id') ? parseInt(urlParams.get('id') as string) : 0;

  let characterList: Character[] = [];

  getRequest(`${api}/session/hello?token=${token}`,
  (data: any) => {},
  (data: any) => {
    Notify.failure(data.message);
    checkToken(data.message);
  });

  function handleConfirm() {
    Loading.dots('Creating characters...');

    if (characterList.length === 0) {
      Loading.remove();
      Notify.failure('Please add at least one character.');
      return;
    }

    characterList.forEach((character) => {
      if (character.clazz.id === 0 || character.race.id === 0 || character.title === '') {
        Loading.remove();
        Notify.failure('Please fill in all the fields.');
        return;
      }

      let char = {
        idClass: character.clazz.id,
        idRace: character.race.id,
        idAdventure: idAdventure,
        title: character.title,
        playerName: character.playerName,
      };

      postRequest(`${api}/adventures/${idAdventure}/characters?token=${token}`, char,
        (data: any) => {
          Loading.remove();
          window.location.href = `/adventure?id=${idAdventure}`;
        },
        (data: any) => {
          Loading.remove();
          Notify.failure(data.message);
          checkToken(data.message);
        }
      );
    });
  }
</script>


<Navbar title="Character Creation">
  <LogoutButton />
</Navbar>


<main data-simplebar>
  <div class="container-fluid">
    <div class="row">
      {#each characterList as character, index}
        <CharacterCreationCard bind:characterList={characterList} index={index} />
      {/each}
      {#if characterList.length < 6}
        <CharacterCreationAdd bind:characterList={characterList} />
      {/if}
      <div class="col-xl-12">
        <button class="btn btn-success" on:click={handleConfirm}>Confirm</button>
      </div>
    </div>
  </div>
</main>