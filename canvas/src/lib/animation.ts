import React, { createContext, useContext, useRef } from "react"
import EventEmitter from "./EventEmitter"

type AnimatedEvents = {
    "update": number
}

export class AnimatedValue extends EventEmitter<AnimatedEvents> {
    constructor(public value = 0) {
        super()
        this.addListener("update", (newValue) => {
            this.value = newValue
        })
    }
}

type AnimatedXYEvents = {
    "update": { x: number, y: number }
}

export class AnimatedValueXY extends EventEmitter<AnimatedXYEvents> {
    public x: AnimatedValue
    public y: AnimatedValue

    constructor({ x, y } = { x: 0, y: 0 }) {
        super()
        this.x = new AnimatedValue(x)
        this.y = new AnimatedValue(y)
        this.addListener("update", ({ x, y }) => {
            this.x.emit("update", x)
            this.y.emit("update", y)
        })
    }
}

type AnimationsMap = Record<
    number | string,
    AnimatedValue | AnimatedValueXY
>

type AnimationRegistryContextValue = {
    useAnimation<T extends AnimationsMap[any]>(
        key: keyof AnimationsMap,
        value: T
    ): T,
    getAnimation(key: keyof AnimationsMap): AnimatedValue,
    getAnimationXY(key: keyof AnimationsMap): AnimatedValueXY
}

export const AnimationRegistryContext = createContext<
    AnimationRegistryContextValue
>({} as any)

export function useAnimationRegistry() {
    return useContext(AnimationRegistryContext)
}

export function AnimationRegistryProvider(props: React.PropsWithChildren<{}>) {
    const animations = useRef<AnimationsMap>({}).current

    const context: AnimationRegistryContextValue = {
        useAnimation: (key, value) => {
            if (!(key in animations)) {
                animations[key] = value
            }
            return useRef(animations[key]).current as any
        },
        getAnimation(key) {
            return animations[key] as AnimatedValue
        },
        getAnimationXY(key) {
            return animations[key] as AnimatedValueXY
        }
    }
    
    return React.createElement(AnimationRegistryContext.Provider, {
        ...props,
        value: context
    })
}
