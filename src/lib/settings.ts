export interface Settings {
    mainWindowBottomHeight:number;
    mainWindowRightWidth:number;
    save():void;
}

const settings:Settings = loadSettings();
export default settings;

function saveSettings() {
    localStorage.setItem('settings', JSON.stringify(settings));
}

function loadSettings():Settings {
    let defaults:Settings = {
        mainWindowBottomHeight: 300,
        mainWindowRightWidth: 250,
        save: saveSettings
    };

    let temp = localStorage.getItem("settings");
    if(temp) {
        defaults = {
            ...defaults,
            ...JSON.parse(temp)
        };
    }

    return defaults;
}