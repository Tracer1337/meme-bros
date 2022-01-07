export class TemplateEntity {
    name: string

    constructor(partial: Partial<TemplateEntity>) {
        this.name = partial.name
    }
}
