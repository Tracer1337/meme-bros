import React from "react"
import { useLocation, useParams } from "react-router-dom"
import useSWR, { useSWRConfig } from "swr"
import { API, fetcher } from "../../lib/api"
import TemplateForm, { Fields } from "./TemplateForm"

export type LocationState = API.Template

function UpdateTemplate() {
    const { id } = useParams()

    const locationState = useLocation().state as LocationState
    
    const { error, ...swr } = useSWR<API.Template>(
        !locationState && `templates/${id}`,
        fetcher
    )

    const data = locationState || swr.data

    const { mutate } = useSWRConfig()

    const handleSubmit = async (values: Fields) => {
        if (!id) {
            return
        }
        await API.updateTemplate(id, values)
        mutate("templates")
    }
    
    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <TemplateForm values={data} onSubmit={handleSubmit}/>
    )
}

export default UpdateTemplate
