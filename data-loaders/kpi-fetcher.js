const fs = require("fs")
const datefns = require('date-fns')
function appendToProjectsFile(kpis) {
    const kpisList = readToKpiFile() || []
    kpisList.push(kpis)
    fs.writeFileSync("../_data/kpis.json", JSON.stringify(kpisList, null, 2))
}

function readToProjectsFile() {
    return JSON.parse(fs.readFileSync("../_data/projects.json", {encoding: "utf-8"}))
}

function readToKpiFile() {
    const path = "../_data/kpis.json"
    if (!fs.existsSync(path)) {
        return []
    }
    return JSON.parse(fs.readFileSync(path, {encoding: "utf-8"}))
}

const { projects, contributors } = readToProjectsFile()

const stars = projects.map(e => e.stargazers).reduce((sum, curr) => sum + curr, 0)
const forks = projects.map(e => e.forkCount).reduce((sum, curr) => sum + curr, 0)
const openIssues = projects.map(e => e.openIssues).reduce((sum, curr) => sum + curr, 0)

const activeProjects = getActiveProjectsCount()

function getActiveProjectsCount() {
    const end = new Date()
    const start = datefns.sub(end, {days: 30})
    const monthInterval = datefns.eachMonthOfInterval({start, end})
    const isWithinLastMonth = date =>
        datefns.isWithinInterval(datefns.parseISO(date), {
            start: monthInterval[0],
            end: monthInterval[1]
        })
    return projects.filter(e => isWithinLastMonth(e.pushedAt) || isWithinLastMonth(e.lastIssueCreatedAt)).length
}

appendToProjectsFile({
    stars,
    forks,
    openIssues,
    activeProjects,
    contributors,
    month: datefns.format(datefns.subMonths(new Date(), 1), "MMMM"),
    year: datefns.getYear(new Date())
})