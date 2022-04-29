import { useLocation, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { CircularProgress } from "@mui/material"
import * as API from "@meme-bros/api-sdk"
import { useAPI } from "@meme-bros/api-sdk"
import TemplateForm from "./TemplateForm"

export type LocationState = API.Template

function UpdateTemplate() {
    const { id } = useParams()

    if (!id) {
        throw new Error("Missing param: 'id'")
    }

    const locationState = useLocation().state as LocationState

    const api = useAPI()

    const queryClient = useQueryClient()

    const {
        isLoading: isTemplateLoading,
        isError: isTemplateError,
        data: template
    } = useQuery(
        ["template", id],
        () => api.templates.getOne(id),
        { initialData: locationState }
    )

    const {
        isLoading: isCanvasLoading,
        isError: isCanvasError,
        data: canvas
    } = useQuery(
        ["canvas", id],
        () => api.templates.getCanvas(id)
    )

    const updateMutation = useMutation(
        (payload: Partial<API.CreateTemplate>) => api.templates.update(id, payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["template", id])
                queryClient.invalidateQueries(["canvas", id])
            }
        }
    )
    
    if (isTemplateLoading || isCanvasLoading) return <CircularProgress/>
    if (isTemplateError || !template || isCanvasError || !canvas)
        return <div>Failed to load</div>

    return (
        <TemplateForm
            values={{ ...template, canvas }}
            onSubmit={updateMutation.mutateAsync}
        />
    )
}

export default UpdateTemplate
