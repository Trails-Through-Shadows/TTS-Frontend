<script lang="ts">
  import { Adventure, Campaign } from "../../lib/Exports";
  import { Notify } from "notiflix";

  import Navbar from "../../lib/Components/Navbar.svelte";
  import LogoutButton from "../../lib/Components/LogoutButton.svelte";
  import LoginForm from "./Components/LoginForm.svelte";
  import LoginAdventureCard from "./Components/LoginAdventureCard.svelte";
  import LoginAdventureCreate from "./Components/LoginAdventureCreate.svelte";

  Notify.init({
    clickToClose: true
  });

  let loggedIn = false;
  let adventureList: Adventure[] = [];
  let campaignList: Campaign[] = [];
</script>

<Navbar title={loggedIn ? 'Adventures' : 'Login'}>
  <LogoutButton />
</Navbar>

<main>
  {#if !loggedIn}
    <LoginForm bind:adventureList={adventureList} bind:campaignList={campaignList} bind:loggedIn={loggedIn} />
  {:else}
  <div class="row w-100">
    {#each adventureList as adventure, index}
      <LoginAdventureCard bind:adventureList={adventureList} index={index} />
    {/each}
    {#if adventureList.length < 8}
      <LoginAdventureCreate bind:adventureList={adventureList} bind:campaignList={campaignList} />
    {/if}
  </div>
  {/if}
</main>