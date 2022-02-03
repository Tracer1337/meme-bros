import { useEffect, useRef } from "react"
import { AnyFunction } from "tsdef"
import { EventEmitter } from "@meme-bros/shared"

export type SetListenersArgs<T> = [
    EventEmitter<T>,
    [keyof T, (data: any) => void][]
]

export function setListeners<T>(...[events, handlers]: SetListenersArgs<T>) {
    handlers.forEach(([event, handler]) => events.addListener(event, handler))
    return () => {
        handlers.forEach(([event, handler]) => events.removeListener(event, handler))
    }
}

export function useListeners<T>(...args: SetListenersArgs<T>) {
    useEffect(() => setListeners(...args))
}

export function makeListenerQueue<T>() {
    const queue: [keyof T, any][] = []

    return (...[events, handlers]: SetListenersArgs<T>) => {
        let called = false

        const queuedHandlers = new Map<AnyFunction, AnyFunction>()

        const makeQueuedHandler = (event: keyof T, handler: AnyFunction) => {
            queuedHandlers.set(handler, (data: any) => {
                if (!called) {
                    handler(data)
                    called = true
                    return
                }
                queue.push([event, data])
            })
            return queuedHandlers.get(handler) as AnyFunction
        }
    
        handlers.forEach(([event, handler]) => {
            events.addListener(event, makeQueuedHandler(event, handler))
        })

        const queuedEvent = queue.shift()
        if (queuedEvent) {
            const [event, data] = queuedEvent
            events.emit(event, data)
        }

        return () => {
            handlers.forEach(([event, handler]) => {
                events.removeListener(event, queuedHandlers.get(handler) as AnyFunction)
            })
        }
    }
}

export function useQueuedListeners<T>(...args: SetListenersArgs<T>) {
    const setQueuedListeners = useRef(makeListenerQueue<T>()).current
    useEffect(() => setQueuedListeners(...args))
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

export function consumeEvent(id: number, handler: (data: any) => void) {
    return (_id: number) => {
        if (id !== _id) {
            return
        }
        return handler(id)
    }
}
