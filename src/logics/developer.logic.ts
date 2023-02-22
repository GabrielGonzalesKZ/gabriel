import { Request, Response } from "express"
import { client } from "../database"
import format from "pg-format"
import { DeveloperInfo, DeveloperInfoResult, DeveloperResult, IDeveloperInfo, IDeveloperRequest } from "../interfaces/developers.interfaces"
import { QueryConfig } from "pg"

const createDeveloper = async (req: Request, res: Response): Promise<Response> => {
    try {
        const developerData: IDeveloperRequest = req.body

        const queryString: string = format(
            `
            INSERT INTO
                developers (%I)
            VALUES (%L)
            RETURNING *
        `,
            Object.keys(developerData),
            Object.values(developerData)
        )

        const queryResult: DeveloperResult = await client.query(queryString)

        return res.status(201).json(queryResult.rows[0])

    } catch (error: any) {
        if (error.message.includes('duplicate key value violates unique constraint')) {
            return res.status(409).json({
                message: 'Registration email already exists!'
            })
        }
        if (error.message.includes('null value in column "email" of relation')) {
            return res.status(400).json({
                message: "Missing required keys: email."
            })
        }
        if (error.message.includes('null value in column "name" of relation')) {
            return res.status(400).json({
                message: "Missing required keys: name."
            })
        }
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }

}

const listDeveloper = async (req: Request, res: Response): Promise<Response> => {

    const developerId: number = parseInt(req.params.id)

    const queryString = `
    SELECT
        d.*,
        di."developerSince" AS "developerInfoDeveloperSince",
        di."preferredOS" AS "developerInfoPreferredOS"
    FROM 
	    developers d
    LEFT JOIN 
	    developers_infos di ON d."developerInfoId" = di.id
    WHERE 
            d.id = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [developerId]
    }

    const queryResult: DeveloperInfoResult = await client.query(queryConfig)

    return res.json(queryResult.rows[0])
}


const listAllDevelopers = async (req: Request, res: Response): Promise<Response> => {

    try {
        const queryString: string = `
        
        SELECT
            d.id AS "developerID",
            d.name AS "developerName",
            d.email AS "developerEmail",
            di.id AS "developerInfoID",
            di."developerSince" AS "developerInfoDeveloperSince",
            di."preferredOS" AS "developerInfoPreferredOS"
        FROM
            developers d
        LEFT JOIN
            developers_infos di ON d."developerInfoId" = di.id
        `

        const queryResult = await client.query(queryString)

        return res.status(200).json(queryResult.rows)
    } catch (error) {
        return res.status(500)
    }

}

const listDeveloperProjects = async (req: Request, res: Response): Promise<Response> => {
    try {
        const developerId: number = parseInt(req.params.id)

        const queryString: string = `
        SELECT
            d."id" AS "developerID",
            d."name" AS "developerName",
            d."email" AS "developerEmail",
            di."id" AS "developerInfoID",
            di."developerSince" AS "developerInfoDeveloperSince",
            di."preferredOS" AS "developerInfoPreferredOS",
            p."id" AS "projectID",
            p."name" AS "projectName",
            p."estimatedTime" AS "projectDescription",
            p."estimatedTime" AS "projectEstimatedTime",
            p."repository" AS "projectRepository",
            p."startDate" AS "projectStartDate",
            p."endDate" AS "projectEndDate",
            pt."technologyId",
            t.name AS "technologyName"
        FROM
            developers d
        LEFT JOIN
            developers_infos di ON d."developerInfoId" = di.id
        LEFT JOIN 
            projects p ON p."developerId" = d.id
        LEFT JOIN
            projects_technologies pt ON p."id" = pt."projectId"
        LEFT JOIN
            technologies t ON t.id = pt."technologyId"
        WHERE
            d.id = $1
        `

        const queryConfig: QueryConfig = {
            text: queryString,
            values: [developerId],
        }

        const queryResult = await client.query(queryConfig)

        return res.status(200).json(queryResult.rows)
    } catch (error: any) {
        console.log(error.message)
        return res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}

const createDeveloperInfo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const developerId: number = parseInt(req.params.id)
        const developerInfoData: IDeveloperInfo = req.body

        let queryString: string = format(
            `
                INSERT INTO
                    developers_infos (%I)
                VALUES(%L)
                RETURNING *
            `,
            Object.keys(developerInfoData),
            Object.values(developerInfoData)
        )

        let queryResult: DeveloperInfo = await client.query(queryString)

        queryString = `
            UPDATE
                developers
            SET
                "developerInfoId" = $1
            WHERE
                id = $2
            RETURNING *
        `

        const queryConfig: QueryConfig = {
            text: queryString,
            values: [queryResult.rows[0].id, developerId]
        }

        await client.query(queryConfig)

        return res.status(201).json(queryResult.rows[0])

    } catch (error: any) {
        if (error.message.includes(`invalid input value for enum "preferredOS"`)) {
            return res.status(400).json({
                message: 'The preferred system should be: Windows, Linux or MacOs.'
            })
        }
        if (error.message.includes('null value in column "preferredOS" of relation')) {
            return res.status(400).json({
                message: "Missing required keys: preferredOS."
            })
        }
        if (error.message.includes('null value in column "developerSince" of relation')) {
            return res.status(400).json({
                message: "Missing required keys: developerSince."
            })
        }
        if (error.message.includes('duplicate key value violates unique constraint')) {
            return res.status(409).json({
                message: "Registration preferred OS already exists!."
            })
        }
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

const deleteDeveloper = async (req: Request, res: Response): Promise<Response> => {
    const developerId: number = parseInt(req.params.id)

    const queryString: string = `
    DELETE FROM
        developers 
    WHERE 
        id = $1  
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [developerId],
    }

    await client.query(queryConfig)
    return res.status(204).json()
}

const updateDeveloper = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IDeveloperRequest = { name: '', email: '', }

        if (req.body.name) {
            data.name = req.body.name
        }
        if (req.body.email) {
            data.email = req.body.email
        }
        if (data.name === '') {
            delete data.name
        }
        if (data.email === '') {
            delete data.email
        }

        if (Object.keys(data).length < 1) {
            return res.status(400).json({
                message: 'At least one of those keys must be send.',
                keys: ['name', 'email'],
            })
        }
        const developerId: number = parseInt(req.params.id)
        const developerData = Object.values(data)
        const developerKeys = Object.keys(data)

        const queryString: string = format(
            `
            UPDATE
                developers
            SET (%I) = ROW (%L)
            WHERE
                id = $1
            RETURNING *
            `,
            developerKeys,
            developerData
        )

        const queryConfig: QueryConfig = {
            text: queryString,
            values: [developerId],
        }

        const queryResult = await client.query(queryConfig)

        return res.status(201).json(queryResult.rows[0])
    } catch (error: any) {
        if (
            error.message.includes(
                'duplicate key value violates unique constraint "developers_email_key"'
            )
        ) {
            return res.status(409).json({
                message: 'E-mail already exists',
            })
        } else if (error instanceof Error) {
            console.log(error)
            return res.status(400).json({
                message: error.message,
            })
        }
        return res.status(500).json({
            message: 'Internal server error',
        })
    }
}


export { createDeveloper, listDeveloper, listAllDevelopers, createDeveloperInfo, listDeveloperProjects, deleteDeveloper, updateDeveloper }