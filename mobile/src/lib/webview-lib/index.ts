import fittext from "./fittext"

const modules = [fittext]

export default modules
    .map((script) => `<script>${script}</script>`)
    .join()
