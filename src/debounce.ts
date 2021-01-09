type Procedure = (...args: any[]) => void;

export interface DebouncedFunction<F extends Procedure> {
    (this: ThisParameterType<F>, ...args: Parameters<F>): void;
    cancel: () => void;
}

export function debounce<F extends Procedure>(
    func: F,
    waitMilliseconds = 100,
    isImmediate?:boolean
): DebouncedFunction<F> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const debouncedFunction = function(this: ThisParameterType<F>, ...args: Parameters<F>) {
        const context = this;

        const doLater = function() {
            timeoutId = undefined;
            if (!isImmediate) {
                func.apply(context, args);
            }
        }

        const shouldCallNow = isImmediate && timeoutId === undefined;

        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(doLater, waitMilliseconds);

        if (shouldCallNow) {
            func.apply(context, args);
        }
    }

    debouncedFunction.cancel = function() {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
    }

    return debouncedFunction;
}