import React from "react"

function makeElement<T>(Component: React.ComponentType<T>) {
    return (props: T) => {
        return (
            <Component {...props}/>
        )
    }
}

export default makeElement
