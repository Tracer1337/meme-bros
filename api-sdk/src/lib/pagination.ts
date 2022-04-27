import { mutate } from "swr"
import { Getter } from "./getter"

export type PaginationQuery = {
    page?: number
}

export class PaginatedGetter<T> extends Getter<T, [] | [PaginationQuery]> {
    private cachedPages = new Set<number>()
    
    constructor(...args: ConstructorParameters<typeof Getter>) {
        super(...args)
        this.overridePath()
    }

    private overridePath() {
        const path = this.path
        this.path = (query?: PaginationQuery) => {
            if (query?.page === undefined) return path()
            this.cachedPages.add(query.page)
            return `${path()}?page=${query.page}`
        }
    }

    public async mutate(query?: PaginationQuery) {
        if (query) return mutate(this.path(query))
        this.cachedPages.forEach((page) => mutate(this.path({ page })))
        this.cachedPages.clear()
        return []
    }
}
