const MEMORY_LEAK_THRESHOLD = 10

type Options = {
    suppressWarnings: boolean
}

export class EventEmitter<Events extends Record<string, any>> {
    suppressWarnings: boolean = false
    listeners: Partial<
        Record<
            keyof Events,
            ((data: any) => void)[]
        >
    > = {}

    constructor(options?: Options) {
        if (options) {
            this.suppressWarnings = options.suppressWarnings
        }
    }

    addListener<T extends keyof Events>(event: T, handler: (data: Events[T]) => void) {
        let listeners = this.listeners[event]
        if (!listeners) {
           listeners = this.listeners[event] = [] 
        }
        listeners.push(handler)
        if (listeners.length > MEMORY_LEAK_THRESHOLD && !this.suppressWarnings) {
            console.warn(
                `The event '${event}' has more than ${MEMORY_LEAK_THRESHOLD} event handlers. This may indicate a memory leak in your application.`
            )
        }
    }

    removeListener<T extends keyof Events>(event: T, handler: (data: Events[T]) => void) {
        const listeners = this.listeners[event]
        if (!listeners) {
            return
        }
        const index = listeners.findIndex((_handler) => handler === _handler)
        if (index === -1) {
            return
        }
        listeners.splice(index, 1)
    }

    emit<T extends keyof Events>(
        ...[event, data, notify = true]:
            Events[T] extends undefined
                ? [T] | [T, Events[T]] | [T, Events[T], boolean]
                : [T, Events[T]] | [T, Events[T], boolean]
    ) {
        if (event !== "emit" && notify) {
            // @ts-ignore
            this.emit("emit", { event, data })
        }
        const listeners = this.listeners[event]
        if (!listeners) {
            return
        }
        listeners.forEach((handler) => handler(data))
    }
}
