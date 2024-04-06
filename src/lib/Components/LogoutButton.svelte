<script lang="ts">
  import { api } from "../Exports";
  import ConfirmModal from "./ConfirmModal.svelte";
  
  function confirmLogout() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          sessionStorage.setItem('licenseId', '');
          sessionStorage.setItem('token', '');

          window.location.href = '/';
        } else {
          console.error('Error:', request.responseText);
        }
      }
    };
    request.open('DELETE', `${api}/session/logout?token=${sessionStorage.getItem('token')}`);
    request.send();
  }

  let showConfirmModal = false;

  function showModal() {
    showConfirmModal = true;
  }
</script>

<ConfirmModal title="Logout" body="Are you sure you want to logout?" buttonText="Logout" onConfirm={confirmLogout} bind:showConfirmModal={showConfirmModal} />

<button class="btn btn-danger" on:click={showModal}>
  Logout
</button>