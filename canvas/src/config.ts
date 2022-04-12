const config = {
    debug: window.process?.env?.NODE_ENV === "development"
} as const

export default config
