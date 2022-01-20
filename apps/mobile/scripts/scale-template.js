const fs = require("fs")
const path = require("path")

const id = process.argv[2]

if (!id) {
    throw new Error("Missing argument: 'id'")
}

function getTemplatePath(id) {
    return path.join(__dirname, "..", "android", "app", "src", "main", "assets", "templates", `${id}.json`)
}

function importTemplate(id) {
    return JSON.parse(
        fs.readFileSync(getTemplatePath(id), "utf8")
    )
}

function transformTemplate(template) {
    delete template.pixelRatio
    
    const width = template.width

    template.width = template.width / width
    template.height = template.height / width

    if ("base" in template) {
        scaleRect(template.base, "rect", width)
    }

    template.layers.forEach((id) => {
        scaleRect(template.elements[id], "rect", width)
    })
}

function scaleRect(obj, key, width) {
    obj[key] = {
        ...obj[key],
        x: obj[key].x / width,
        y: obj[key].y / width,
        width: obj[key].width / width,
        height: obj[key].height / width
    }
}

function writeTemplate(id, template) {
    fs.writeFileSync(
        getTemplatePath(id),
        JSON.stringify(template, null, 4)
    )
}

function scaleTemplate(id) {
    const template = importTemplate(id)
    transformTemplate(template)
    writeTemplate(id, template)
}

scaleTemplate(id)
