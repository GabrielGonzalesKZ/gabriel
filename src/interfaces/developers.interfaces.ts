import { QueryResult } from "pg";

//developers interfaces
interface IDeveloperRequest {
    name?: string,
    email?: string
}

interface IDeveloper extends IDeveloperRequest {
    id: number,
    developerInfoId: number | null
}

interface IDeveloperInfo {
    developerSince: Date,
    preferredOS: string
}

interface IDeveloperInfoResult extends IDeveloper{
    id: number,
    developerSince: string,
    preferredOS: string
}

interface IDeveloperInfoCreate {
    id: number,
    developerSince: string,
    preferredOS: string
}

type DeveloperResult = QueryResult<IDeveloper>
type DeveloperInfoResult = QueryResult<IDeveloperInfoResult>
type DeveloperInfo = QueryResult<IDeveloperInfoCreate>

export { IDeveloperRequest, IDeveloperInfo, DeveloperResult, DeveloperInfoResult, DeveloperInfo }