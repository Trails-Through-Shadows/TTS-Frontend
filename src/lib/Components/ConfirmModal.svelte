<script lang="ts">
	export let title: string = 'Confirm';
	export let body: string = 'Are you sure?';
	export let buttonText: string = 'Confirm';
	export let showConfirmModal: boolean = false;

	export let onConfirm: () => void;

  function confirm() {
    showConfirmModal = false;
    onConfirm();
  }
</script>


{#if showConfirmModal}
  <div id="ConfirmModal" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{title}</h5>
        </div>
        <div class="modal-body">
          {body}
        </div>
        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-danger" on:click={() => showConfirmModal = false}>Cancel</button>
          <button type="button" class="btn btn-success" on:click={confirm}>{buttonText}</button>
        </div>
      </div>
    </div>
  </div>
{/if}


<style>
  .modal {
    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content{
    color: #bababa;
    background-color: #222;
  }

  .modal-content > div {
    border-color: #1c1c1c;
  }
</style>