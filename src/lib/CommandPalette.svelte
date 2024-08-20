<script lang="ts">
    import { AutoComplete } from "./util/autocomplete";
    import stage from "./stage";
    import zoomHelper from "./util/zoom_helper";
    import blackboard from "./blackboard";
    import { onMount, tick } from "svelte";

    let show = false;
    let input: HTMLInputElement;
    let blocker: HTMLElement;

    let autoComplete: AutoComplete = new AutoComplete();

    //a list of all registered command names and their parameters
    let commandToParameters: { [key: string]: string } = {};

    let suggestedCommands: string[] = [];
    let selectedCommand = 0;

    document.body.addEventListener("keyup", async (e: KeyboardEvent) => {
        if (show) {
            return;
        }

        if (e.ctrlKey && e.key == ".") {
            show = true;
        }

        document.body.addEventListener("click", close);
        await tick();
        input.value = "";
        input.focus();

        refreshSuggestedCommandsWithPartial("");
    });

    initializeCommands();

    function onInputKeyDown(e: KeyboardEvent) {
        e.stopImmediatePropagation();

        switch (e.keyCode) {
            case 13: //enter
                onEnterPress();
                break;
            case 40: //down
                selectedCommand = Math.min(
                    selectedCommand + 1,
                    suggestedCommands.length - 1,
                );
                e.preventDefault();
                break;
            case 38: //up
                selectedCommand = Math.max(0, selectedCommand - 1);
                e.preventDefault();
                break;
            case 27: //esc
                close();
                break;
        }
    }

    function onEnterPress() {
        let command = input.value.trim();

        if (/^.+?\(.*?\);?$/.test(command)) {
            //we have a complete command, so run it
            runCommand(command);
            close();
        } else {
            //otherwise, we autocomplete with a suggested command
            let suggestedCommand = suggestedCommands[selectedCommand];
            if (suggestedCommand.endsWith("()")) {
                // if there are no parameters to add, run immediately
                runCommand(suggestedCommand);
                close();
            } else {
                completeWithSuggestedCommand(suggestedCommand);
            }
        }
    }

    function runCommand(command: string) {
        window.eval(command);
    }

    // fills in the autocoplete with the given suggested command
    function completeWithSuggestedCommand(suggestedCommand: string) {
        suggestedCommand = removeParametersFromCommand(suggestedCommand);
        input.value = suggestedCommand + "()";

        //set the text cursor inside the brackets
        let startOfParameters = suggestedCommand.length + 1;
        input.selectionStart = startOfParameters;
        input.selectionEnd = startOfParameters;

        refreshSuggestedCommandsWithPartial(suggestedCommand);
    }

    function onInputChanged() {
        let command = input.value;
        command = removeParametersFromCommand(command);
        refreshSuggestedCommandsWithPartial(command);
    }

    function close(e: MouseEvent | null = null) {
        if (e && e.target != blocker) {
            return;
        }

        document.body.removeEventListener("click", close);
        show = false;
    }

    function addCommand(
        commandName: string,
        parameters: string,
        callback: any,
    ) {
        autoComplete.addWord(commandName);
        window[commandName as any] = callback;
        commandToParameters[commandName] = parameters;
    }

    function removeParametersFromCommand(command: string): string {
        let index = command.indexOf("(");
        if (index == -1) {
            return command;
        } else {
            return command.substring(0, index);
        }
    }

    function refreshSuggestedCommandsWithPartial(partial: string) {
        if (partial == "") {
            suggestedCommands = getAllCommands();
        } else {
            suggestedCommands = autoComplete
                .getMatches(partial)
                .map((command) => command + commandToParameters[command]);
        }

        suggestedCommands.sort();
        selectedCommand = 0;
    }

    // returns a list of all possible commands including their parameter hints
    function getAllCommands(): string[] {
        return Object.keys(commandToParameters).map(
            (c) => c + commandToParameters[c],
        );
    }

    function initializeCommands() {
        addCommand("resetZoom", "()", () => stage.zoomCenter(100));
        addCommand("setZoom", "(value:number)", (value) =>
            stage.zoomCenter(value),
        );
        addCommand("zoomIn", "()", () =>
            stage.zoomCenter(
                zoomHelper.getNextZoomInValue(blackboard.zoom.value),
            ),
        );
        addCommand("zoomOut", "()", () =>
            stage.zoomCenter(
                zoomHelper.getNextZoomOutValue(blackboard.zoom.value),
            ),
        );
    }
</script>

<div id="blocker" bind:this={blocker} style:display={show ? "" : "none"}></div>
<command_palette style:display={show ? "" : "none"}>
    <input
        on:keydown={onInputKeyDown}
        on:input={onInputChanged}
        bind:this={input}
        type="text"
    />
    <div id="suggestedCommands">
        {#each suggestedCommands as command, i}
            <div
                class="suggestedCommand"
                class:suggestedCommandSelected={i == selectedCommand}
            >
                {command}
            </div>
        {/each}
    </div>
</command_palette>

<style lang="scss">
    command_palette {
        position: absolute;
        display: block;
        top: 5px;
        left: 50%;
        z-index: 2;
        transform: translate(-50%, 0);
        padding: 5px;
        background-color: black;
        border: 1px solid #aaaaaa;
        width: 350px;
        max-width: 90%;
        border-radius: 5px;
        box-shadow: -1px 1px 3px black;
    }

    #blocker {
        position: absolute;
        width: 100vw;
        height: 100vh;
        background-color: transparent;
        top: 0;
        left: 0;
        z-index: 2;
    }

    #suggestedCommands {
        max-height: 400px;
        overflow-y: auto;
    }

    input {
        background-color: #555555;
        border: 1px solid #aaaaaa;
        color: white;
        padding: 4px;
        font-family: monospace;
        width: 100%;
    }

    .suggestedCommand:first-of-type {
        margin-top: 4px;
    }

    .suggestedCommand {
        background-color: #222222;
        color: #ccc;
        padding: 5px 2px 5px 4px;
        font-family: monospace;
        cursor: pointer;
    }

    .suggestedCommand:hover {
        background-color: #333333;
    }

    .suggestedCommandSelected {
        background-color: #5287bb !important;
    }
</style>
