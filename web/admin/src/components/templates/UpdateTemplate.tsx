import React from "react"
import { useParams } from "react-router-dom"
import useSWR, { useSWRConfig } from "swr"
import { API, fetcher } from "../../lib/api"
import TemplateForm, { Fields } from "./TemplateForm"

function UpdateTemplate() {
    const { id } = useParams()
    
    const { data, error } = useSWR<API.Template>(`templates/${id}`, fetcher)

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
