export class Trend {
    private subjects: Set<string> = new Set()
    
    private scores: Record<string, number> = {}
    
    constructor(private damping: number, private reduction: number) {}

    public loadScores(scores: Record<string, number>) {
        Object.entries(scores).forEach(([subject, score]) => {
            this.subjects.add(subject)
            this.scores[subject] = score
        })
    }

    public addSubject(subject: string) {
        this.subjects.add(subject)
        this.scores[subject] = 0
    }

    public removeSubject(subject: string) {
        this.subjects.delete(subject)
        delete this.scores[subject]
    }

    public hasSubject(subject: string) {
        return this.subjects.has(subject)
    }

    public syncSubjects(subjects: string[]) {
        const added = subjects.filter((subject) =>
            !this.subjects.has(subject)
        )
        const removed = Array.from(this.subjects).filter((subject) =>
            !subjects.includes(subject)
        )
        added.forEach(this.addSubject.bind(this))
        removed.forEach(this.removeSubject.bind(this))
    }

    public getScores() {
        return this.scores
    }

    public hit(subject: string) {
        if (!(subject in this.scores)) {
            throw new ReferenceError()
        }
        this.subjects.forEach((_subject) => {
            const score = this.scores[_subject]
            if (_subject === subject) {
                this.scores[_subject] += (1 - score) / this.damping
            } else {
                this.scores[_subject] -= score / this.reduction
            }
        })
    }

    public getTrendingSubjects() {
        return Array.from(this.subjects)
            .filter((subject) => this.getScore(subject) > 0)
            .sort((a, b) => this.getScore(b) - this.getScore(a))
    }

    private getScore(subject: string) {
        if (!(subject in this.scores)) {
            throw new ReferenceError()
        }
        return this.scores[subject]
    }
}
