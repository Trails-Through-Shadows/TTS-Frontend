import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "simplebar/dist/simplebar.min.css";
import "simplebar/dist/simplebar.min.js";
import "jquery/dist/jquery.min.js";

import './main.css'
import App from './pages/App.svelte'

const app = new App({
  target: document.getElementById('app')!,
})

export default app
