const fs = require("fs")
const path = require("path")

const NODE_MODULES = "node_modules"
const APPS = "apps"
const WEB = "web"
const ADMIN = "admin"
const STYLIS = "stylis"
const REACT_HOOK_FORM = "react-hook-form"

const PACKAGE_JSON = "package.json"

function patchPackageJSON(packagePath, patch) {
    const packageJsonPath = path.join(
        packagePath,
        PACKAGE_JSON
    )
    const packageFile = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
    patch(packageFile)
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageFile, null, 2))
}

function patchStylisPackage() {
    patchPackageJSON(
        path.join(__dirname, NODE_MODULES, STYLIS),
        (packageFile) => {
            packageFile.module = packageFile.main
        }
    )
}

function patchReactHookFormPackage() {
    patchPackageJSON(
        path.join(__dirname, APPS, WEB, ADMIN, NODE_MODULES, REACT_HOOK_FORM),
        (packageFile) => {
            packageFile.module = packageFile.main
        }
    )
}

function patchPackages() {
    patchStylisPackage()
    patchReactHookFormPackage()
}

patchPackages()
