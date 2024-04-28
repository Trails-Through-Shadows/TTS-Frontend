<script lang="ts">
  import { Adventure, Campaign } from "../../lib/Exports";
  import { Notify } from "notiflix";

  import Navbar from "../../lib/Components/Navbar.svelte";
  import LogoutButton from "../../lib/Components/LogoutButton.svelte";
  import LoginForm from "./Components/LoginForm.svelte";
  import LoginAdventure from "./Components/LoginAdventure.svelte";

  Notify.init({
    clickToClose: true
  });

  let loggedIn = false;
  let adventureList: Adventure[] = [];
  let campaignList: Campaign[] = [];

  sessionStorage.setItem('adventureId', '0');
</script>

{#if !loggedIn}
  <Navbar title="Login" />
{:else}
  <Navbar title="Adventures">
    <LogoutButton />
  </Navbar>
{/if}

<main>
  {#if !loggedIn}
    <LoginForm bind:adventureList={adventureList} bind:campaignList={campaignList} bind:loggedIn={loggedIn} />
  {:else}
    <LoginAdventure bind:adventureList={adventureList} bind:campaignList={campaignList} />
  {/if}
</main>