import EventEmitter from "./EventEmitter"

export function setListeners<T>(
    events: EventEmitter<T>,
    handlers: [keyof T, (data: any) => void][]
) {
    handlers.forEach(([event, handler]) => events.addListener(event, handler))
    return () => {
        handlers.forEach(([event, handler]) => events.removeListener(event, handler))
    }
}

export function consumeEvent(id: number, handler: (data: any) => void) {
    return (_id: number) => {
        if (id !== _id) {
            return
        }
        return handler(id)
    }
}
