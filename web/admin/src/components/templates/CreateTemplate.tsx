import React from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@meme-bros/api-sdk/dist/admin"
import TemplateForm, { Fields } from "./TemplateForm"

function CreateTemplate() {
    const navigate = useNavigate()
    
    const handleSubmit = async (values: Fields) => {
        const template = await api.templates.create(values)
        api.templates.all.mutate()
        navigate(`/templates/${template.id}`)
    }
    
    return (
        <TemplateForm onSubmit={handleSubmit}/>
    )
}

export default CreateTemplate
