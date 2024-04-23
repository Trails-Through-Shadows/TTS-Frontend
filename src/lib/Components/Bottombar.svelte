<footer class="bottombar">
  <div class="navbar-links">
    <slot />
  </div>
</footer>

<style>
.bottombar {
  background-color: #222;
  color: #4fc780;
  padding: 12.5px;
  height: auto;
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.navbar-links {
  display: flex;
  justify-content: flex-end;
}
</style>