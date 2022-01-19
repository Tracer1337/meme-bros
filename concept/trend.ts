class Subject {
    constructor(public id: any) {}
}

class Trend {
    private scores: Map<Subject, number> = new Map()
    
    constructor(
        private subjects: Subject[],
        private damping: number,
        private reduction: number,
    ) {
        this.subjects.forEach((subject) => this.addSubject(subject))
    }

    public addSubject(subject: Subject) {
        this.scores.set(subject, 0)
    }

    public removeSubject(subject: Subject) {
        this.scores.delete(subject)
    }

    public hit(subject: Subject) {
        if (!this.scores.has(subject)) {
            throw new ReferenceError()
        }
        this.scores.forEach((score, _subject) => {
            if (_subject === subject) {
                this.scores.set(
                    _subject,
                    this.getScore(_subject) + (1 - this.getScore(_subject)) / this.damping
                )
            } else {
                this.scores.set(
                    _subject,
                    this.getScore(_subject) + this.getScore(_subject) / this.reduction
                )
            }
        })
    }

    public getTrendingSubjects() {
        const sorted = this.subjects.filter((subject) => this.getScore(subject) > 0)
        sorted.sort((a, b) => this.getScore(b) - this.getScore(a))
        return sorted
    }

    private getScore(subject: Subject) {
        const score = this.scores.get(subject)
        if (score === undefined) {
            throw new ReferenceError()
        }
        return score
    }
}

const ids = ["a", "b", "c", "d", "e"]
const subjects = ids.map((id) => new Subject(id))
const trend = new Trend(subjects, 10, 100)

trend.hit(subjects[2])

console.log(trend)
console.log(trend.getTrendingSubjects())
