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
