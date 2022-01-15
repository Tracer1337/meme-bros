import React from "react"
import { useNavigate } from "react-router-dom"
import { useSWRConfig } from "swr"
import { API } from "../../lib/api"
import TemplateForm, { Fields } from "./TemplateForm"

function CreateTemplate() {
    const navigate = useNavigate()
    
    const { mutate } = useSWRConfig()

    const handleSubmit = async (values: Fields) => {
        const template = await API.createTemplate(values)
        mutate("templates")
        navigate(`/templates/${template.id}`)
    }
    
    return (
        <TemplateForm onSubmit={handleSubmit}/>
    )
}

export default CreateTemplate
