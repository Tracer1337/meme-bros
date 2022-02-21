import ora from "ora"
import progress from "cli-progress"
import { AdminAPI } from "@meme-bros/api-sdk/dist/admin/index.js"
import { makeId } from "@meme-bros/client-lib/dist/utils.js"
import { getDefaultDataByType } from "@meme-bros/client-lib/dist/editor.js"
import EasyMemeAPI from "./lib/easymeme.js"
import sharp from "sharp"

const api = new AdminAPI({
    host: process.env.ADMIN_API_HOST || "http://localhost:5000"
})

const easymeme = new EasyMemeAPI()

const spinner = ora("Logging in").start()

async function fetchImage(template) {
    const res = await easymeme.getImage(template)
    return await sharp(res.data).png().toBuffer({
        resolveWithObject: true
    })
}

function convertColor(color) {
    if (color === "white") return "#ffffff"
    if (color === "black") return "#000000"
    return color
}

async function renderCanvas(template) {
    const model = JSON.parse(template.model)

    const borderSize = (model.border?.size || 0) / 100
    const border = {
        color: model.border?.color || "#ffffff",
        top: +(model.border?.top || 0) * borderSize,
        right: +(model.border?.right || 0) * borderSize,
        bottom: +(model.border?.bottom || 0) * borderSize,
        left: +(model.border?.left || 0) * borderSize,
    }

    const canvas = {
        width: 1 + border.left + border.right,
        height: 1 + border.top + border.bottom,
        debug: false,
        mode: 0,
        backgroundColor: convertColor(border.color),
        elements: {},
        layers: []
    }

    const image = await fetchImage(template)
    const aspectRatio = image.info.height / image.info.width

    const baseElement = {
        id: 0,
        type: "image",
        rect: {
            x: border.left,
            y: border.top,
            width: 1,
            height: 1 * aspectRatio,
            rotation: 0
        },
        data: {
            ...getDefaultDataByType("image"),
            uri: "data:image/png;base64," + image.data.toString("base64"),
            naturalWidth: image.info.width,
            naturalHeight: image.info.height
        }
    }

    canvas.elements[baseElement.id] = baseElement
    canvas.layers.push(baseElement.id)

    canvas.base = {
        id: baseElement.id,
        rounded: false,
        padding: Object.values(border).some((n) => n > 0),
        rect: { x: 0, y: 0, width: 1, height: 1, rotation: 0 }
    }

    model.elements.forEach((element) => {
        if (element.type !== "textbox") {
            throw new Error(`Unkown element type: '${element.type}'`)
        }
        const newElement = {
            id: makeId(),
            type: "textbox",
            rect: {
                x: parseFloat(element.data.x) / 100,
                y: parseFloat(element.data.y) / 100,
                width: parseFloat(element.data.width) / 100,
                height: parseFloat(element.data.height) / 100,
                rotation: element.data.rotation
            },
            data: getDefaultDataByType("textbox")
        }
        canvas.elements[newElement.id] = newElement
        canvas.layers.push(newElement.id)
    })

    return canvas
}

async function run() {
    await api.auth.login({
        username: "admin",
        password: "admin"
    })

    spinner.succeed()
    spinner.start("Fetching templates")

    const templates = await easymeme.getTemplates()

    spinner.succeed()

    const bar = new progress.SingleBar()
    bar.start(templates.length, 0)

    await Promise.all(templates.map(async (template) => {
        await api.templates.create({
            name: template.label,
            uses: template.amount_uses,
            canvas: await renderCanvas(template)
        })

        bar.increment()
    }))

    bar.stop()
}

run()
