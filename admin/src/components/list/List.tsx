import React, { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { CircularProgress, List as MuiList, Pagination } from "@mui/material"
import { AnyFunction } from "tsdef"
import { useAPI } from "@meme-bros/api-sdk"
import * as API from "@meme-bros/api-sdk"
import ListItem from "./ListItem"

function List<T>({
    itemComponent,
    keyExtractor,
    labelExtractor,
    queryKey,
    query,
    deleteMutation,
    onDelete,
    ...props
}: React.ComponentProps<typeof MuiList> & {
    itemComponent: React.FunctionComponent<{ item: T }>,
    keyExtractor: (item: T) => number | string,
    labelExtractor?: (item: T) => number | string,
    queryKey: string,
    query: (payload: API.Pagination) => Promise<T[]>,
    deleteMutation: (item: T) => Promise<void>,
    onDelete?: AnyFunction
}) {
    const api = useAPI()
    
    const queryClient = useQueryClient()
    
    const [page, setPage] = useState(0)

    const {
        isLoading,
        isError,
        data
    } = useQuery(
        [queryKey, page],
        () => query({ page, per_page: 10 }),
        {
            staleTime: Infinity,
            keepPreviousData: true
        }
    )

    useEffect(() => {
        queryClient.prefetchQuery(
            [queryKey, page + 1],
            () => query({
                page: page + 1,
                per_page: 10
            }),
            { staleTime: Infinity }
        )
    }, [api, queryClient, page, queryKey, query])

    if (isLoading) return <CircularProgress/>
    if (isError || !data) return <div>Failed to load</div>

    return (
        <div>
            <MuiList {...props}>
                {data.map((item) => (
                    <ListItem
                        key={keyExtractor(item)}
                        label={labelExtractor?.(item) || keyExtractor(item)}
                        deleteMutation={() => deleteMutation(item)}
                        onDelete={() => {
                            queryClient.invalidateQueries(queryKey)
                            onDelete?.()
                        }}
                    >
                        {React.createElement(itemComponent, { item })}
                    </ListItem>
                ))}
            </MuiList>
            <Pagination
                count={Infinity}
                page={page + 1}
                onChange={(_e, value) => setPage(value - 1)}
            />
        </div>
    )
}

export default List
