import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "react-query"
import * as API from "@meme-bros/api-sdk"
import { useAPI } from "@meme-bros/api-sdk"
import TemplateForm from "./TemplateForm"

function CreateTemplate() {
    const api = useAPI()
    
    const queryClient = useQueryClient()
    
    const navigate = useNavigate()

    const submitMutation = useMutation(
        (payload: API.CreateTemplate) => api.templates.create(payload),
        {
            onSuccess: (template: API.Template) => {
                queryClient.invalidateQueries("templates")
                navigate(`/templates/${template.id}`)
            }
        }
    )
    
    return (
        <TemplateForm onSubmit={submitMutation.mutateAsync}/>
    )
}

export default CreateTemplate
