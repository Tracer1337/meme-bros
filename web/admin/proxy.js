const http = require("http")
const httpProxy = require("http-proxy")

const PORT = 8080
const URL = `http://localhost:${PORT}`

const proxy = httpProxy.createProxyServer()

const services = [
    {
        url: "http://localhost:3001",
        prefix: "/iframe"
    },
    {
        url: "http://localhost:4000",
        prefix: ""
    }
]

function findTarget(req) {
    return services.find((service) => req.url.startsWith(service.prefix))
}

const server = http.createServer((req, res) => {
    const target = findTarget(req)

    if (!target) {
        res.statusCode = 404
        res.end()
        return
    }

    proxy.web(req, res, { target: target.url })
})

server.listen(PORT, () => {
    console.log(`Gateway is listening on port ${PORT}`)
    require("open")(URL)
})

proxy.on("error", (error, req, res) => {
    console.log(`An error occured while handling request to: ${req.url}`)
    console.error(error)
    res.end()
})
