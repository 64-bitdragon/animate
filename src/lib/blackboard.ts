import { writable } from "svelte/store";

namespace blackboard {
    export let zoom = writable(100);
}
export default blackboard;