import React from "react"
import { useLocation, useParams } from "react-router-dom"
import * as API from "@meme-bros/api-sdk/dist/admin/types"
import { api } from "@meme-bros/api-sdk/dist/admin/api"
import TemplateForm, { Fields } from "./TemplateForm"

export type LocationState = API.Template

function UpdateTemplate() {
    const { id } = useParams()

    if (!id) {
        throw new Error("Missing param: 'id'")
    }

    const locationState = useLocation().state as LocationState
    
    const templateReq = api.templates.one.use(id)

    const canvasReq = api.templates.canvas.use(id)

    const template = locationState || templateReq.data

    const handleSubmit = async (values: Fields) => {
        if (!id) {
            return
        }
        await api.templates.update(template, values)
        api.templates.all.mutate()
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
