<script lang="ts">
  export let value: number | null;

  const onNumberPress = (number: number) => () => {
    let str = value === null ? '' : value.toString();
    str += number.toString();
    value = parseInt(str);
  };

  const onBackspace = () => {
    let str = value === null ? '' : value.toString();
    str = str.slice(0, -1);
    value = str === '' ? null : parseInt(str);
  };

  const onClear = () => {
    value = null;
  };
</script>


<div class="num-pad">
  {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as number}
    <button class="btn btn-lg btn-success" on:click={onNumberPress(number)}>{number}</button>
  {/each}
  <button class="btn btn-lg btn-danger" on:click={onBackspace}><i class="bi bi-backspace"></i></button>
  <button class="btn btn-lg btn-success" on:click={onNumberPress(0)}>0</button>
  <button class="btn btn-lg btn-danger" on:click={onClear}><i class="bi bi-arrow-repeat"></i></button>
</div>

<style>
  .num-pad {
    display: flex;
    flex-wrap: wrap;
    width: 156px;
    margin: 0 auto;
  }

  .num-pad .btn {
    margin: 1px;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>