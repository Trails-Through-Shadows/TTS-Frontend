<script lang="ts">
  import { api } from "../Exports";
  import { deleteRequest } from "../Functions";
  import ConfirmModal from "./ConfirmModal.svelte";

  import { Notify } from "notiflix";

  function confirmLogout() {
    deleteRequest(`${api}/session/logout`, sessionStorage.getItem('token'),
      () => {
        sessionStorage.setItem('licenseId', '');
        sessionStorage.setItem('token', '');

        window.location.href = '/';
      },
      (data: any) => {
        Notify.failure(data.message)
      }
    );
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