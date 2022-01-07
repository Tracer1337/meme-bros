const fs = require("fs")
const path = require("path")

const NODE_MODULES = "node_modules"
const STYLIS = "stylis"

const PACKAGE_JSON = "package.json"

function patchPackageJSON(package, patch) {
    const packageJsonPath = path.join(
        __dirname,
        NODE_MODULES,
        package,
        PACKAGE_JSON
    )
    const packageFile = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
    patch(packageFile)
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageFile, null, 2))
}

function patchStylisPackage() {
    patchPackageJSON(STYLIS, (packageFile) => {
        packageFile.module = packageFile.main
    })
}

function patchPackages() {
    patchStylisPackage()
}

patchPackages()
