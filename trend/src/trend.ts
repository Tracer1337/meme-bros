export class Subject {
    constructor(public id: string) {}
}

export class Trend {
    private subjects: Set<Subject> = new Set()
    
    private scores: Map<Subject, number> = new Map()
    
    constructor(private damping: number, private reduction: number) {}

    public addSubject(subject: Subject) {
        this.subjects.add(subject)
        this.scores.set(subject, 0)
    }

    public removeSubject(subject: Subject) {
        this.subjects.delete(subject)
        this.scores.delete(subject)
    }

    public hit(subject: Subject) {
        if (!this.scores.has(subject)) {
            throw new ReferenceError()
        }
        this.scores.forEach((score, _subject) => {
            if (_subject === subject) {
                this.scores.set(_subject, score + (1 - score) / this.damping)
            } else {
                this.scores.set(_subject, score + score / this.reduction)
            }
        })
    }

    public getTrendingSubjects() {
        return Array.from(this.subjects)
            .filter((subject) => this.getScore(subject) > 0)
            .sort((a, b) => this.getScore(b) - this.getScore(a))
    }

    private getScore(subject: Subject) {
        const score = this.scores.get(subject)
        if (score === undefined) {
            throw new ReferenceError()
        }
        return score
    }
}
