const MEMORY_LEAK_THRESHOLD = 10

class EventEmitter<Events extends Record<string, any>> {
    listeners: Partial<
        Record<
            keyof Events,
            ((data: any) => void)[]
        >
    > = {}

    addListener<T extends keyof Events>(event: T, handler: (data: Events[T]) => void) {
        let listeners = this.listeners[event]
        if (!listeners) {
           listeners = this.listeners[event] = [] 
        }
        listeners.push(handler)
        if (listeners.length > MEMORY_LEAK_THRESHOLD) {
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

    emit<T extends keyof Events>(event: T, data: Events[T]) {
        const listeners = this.listeners[event]
        if (!listeners) {
            return
        }
        listeners.forEach((handler) => handler(data))
    }
}

export function setListeners<T>(
    events: EventEmitter<T>,
    handlers: [keyof T, (data: T[keyof T]) => void][]
) {
    handlers.forEach(([event, handler]) => events.addListener(event, handler))
    return () => {
        handlers.forEach(([event, handler]) => events.removeListener(event, handler))
    }
}

export default EventEmitter
