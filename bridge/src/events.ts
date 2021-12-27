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

export function setDOMListeners(
    events: any,
    handlers: [string, (data: any) => void][]
) {
    handlers.forEach(([event, handler]) => events.addEventListener(event, handler))
    return () => {
        handlers.forEach(([event, handler]) => events.removeEventListener(event, handler))
    }
}