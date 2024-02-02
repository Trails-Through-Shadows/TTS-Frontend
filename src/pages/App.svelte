<script>
    import { Router, Route } from "svelte-routing";
    import Login from "./login/Login.svelte";
    import Encounter from "./encounter/Encounter.svelte";
    import CharCreate from "./charCreate/CharCreate.svelte";
</script>

<Router>
    <Route path="/encounter" component={Encounter} />
    <Route path="/char" component={CharCreate} />
    <Route path="/" component={Login} />
    <Route ><h1>404</h1><br>AAAAAAAAAAAAAA</Route>
</Router>