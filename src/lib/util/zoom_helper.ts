namespace zoomHelper {
    export const defaultOptions = [50, 75, 100, 150, 200, 300];

    export function getNextZoomInValue(currentValue:number):number {
        if(currentValue < defaultOptions[0]) {
            return defaultOptions[0];
        }

        if(currentValue >= defaultOptions[defaultOptions.length - 1]) {
            return currentValue + 100;
        }

        for(let i = 0;i < defaultOptions.length;i++) {
            if(currentValue == defaultOptions[i]) {
                return defaultOptions[i + 1];
            }

            if(currentValue > defaultOptions[i]  && currentValue < defaultOptions[i + 1]) {
                return defaultOptions[i + 1];
            }
        }

        throw new Error();
    }

    export function getNextZoomOutValue(currentValue:number):number {
        if(currentValue <= defaultOptions[0]) {
            return currentValue / 2;
        }

        if(currentValue > defaultOptions[defaultOptions.length - 1] + 100) {
            return currentValue - 100;
        }

        if(currentValue > defaultOptions[defaultOptions.length - 1]) {
            return defaultOptions[defaultOptions.length - 1];
        }

        for(let i = defaultOptions.length - 1;i > 0;i--) {
            if(currentValue == defaultOptions[i]) {
                return defaultOptions[i - 1];
            }

            if(currentValue < defaultOptions[i] && currentValue > defaultOptions[i - 1]) {
                return defaultOptions[i - 1];
            }
        }

        throw new Error();
    }
}

export default zoomHelper;