import React from "react"
import { useLocation, useParams } from "react-router-dom"
import { useSWRConfig } from "swr"
import { API } from "../../lib/api"
import TemplateForm, { Fields } from "./TemplateForm"

export type LocationState = API.Template

function UpdateTemplate() {
    const { id } = useParams()

    if (!id) {
        throw new Error("Missing param: 'id'")
    }

    const locationState = useLocation().state as LocationState
    
    const templateReq = API.useTemplate(id)

    const canvasReq = API.useTemplateCanvas(id)

    const template = locationState || templateReq.data

    const { mutate } = useSWRConfig()

    const handleSubmit = async (values: Fields) => {
        if (!id) {
            return
        }
        await API.updateTemplate(id, values)
        mutate("templates")
    }
    
    if (templateReq.error || canvasReq.error) {
        return <div>Failed to load</div>
    }
    if (!template || !canvasReq.data) {
        return <div>Loading...</div>
    }

    return (
        <TemplateForm
            values={{ ...template, canvas: canvasReq.data }}
            onSubmit={handleSubmit}
        />
    )
}

export default UpdateTemplate
