CREATE TYPE "preferredOS" AS ENUM ('Windows', 'Linux', 'MacOS');
CREATE TABLE IF NOT EXISTS "developers_infos"(
	"id" SERIAL PRIMARY KEY,
	"developerSince" VARCHAR(15) NOT NULL,
	TYPE "preferredOS" NOT NULL UNIQUE
);
ALTER TABLE developers_infos
	RENAME "type" TO "preferredOS" CREATE TABLE IF NOT EXISTS "developers" (
		"id" SERIAL PRIMARY KEY,
		"name" VARCHAR(50) NOT NULL,
		"email" VARCHAR(60) NOT NULL UNIQUE,
		"developerInfoId" INTEGER UNIQUE,
		FOREIGN KEY ("developerInfoId") REFERENCES "developers_infos"("id")
	);
CREATE TABLE IF NOT EXISTS "projects"(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"description" TEXT NOT NULL,
	"estimatedTime" VARCHAR(20) NOT NULL,
	"repository" VARCHAR(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE,
	"developerId" INTEGER NOT NULL,
	FOREIGN KEY ("developerId") REFERENCES "developers"("id")
);
CREATE TABLE IF NOT EXISTS "technologies"(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(30) NOT NULL
);
\ CREATE TABLE IF NOT EXISTS "projects_technologies"(
	"id" SERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL,
	"projectId" INTEGER NOT NULL,
	FOREIGN KEY ("projectId") REFERENCES "projects"("id"),
	"technologyId" INTEGER NOT NULL,
	FOREIGN KEY ("technologyId") REFERENCES "technologies"("id")
);
SELECT d.*,
	di."id" AS "developerInfoID",
	di."developerSince" AS "developerInfoDeveloperSince",
	di."preferredOS" AS "developerInfoPreferredOS"
FROM developers d
	LEFT JOIN developers_infos di ON d."developerInfoId" = 1
WHERE d.id = 2;
SELECT *
FROM developers_infos di;
ALTER TABLE developers_infos
	RENAME "type" TO "preferredOS";
SELECT *
FROM developers d
	left JOIN developers_infos di ON d."developerInfoId" = di.id;
CREATE TABLE projects (
	"id" BIGSERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"description" TEXT NOT NULL,
	"estimatedTime" VARCHAR(20) NOT NULL,
	"repository" VARCHAR(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE,
	"developerId" INTEGER NOT NULL,
	FOREIGN KEY ("developerId") REFERENCES developers("id") ON DELETE CASCADE
);
CREATE TABLE technologies (
	"id" BIGSERIAL PRIMARY KEY,
	"name" VARCHAR(30) NOT NULL
);
INSERT INTO technologies (name)
VALUES ('Javascript'),
	('Python'),
	('React'),
	('Express.js'),
	('HTML'),
	('CSS'),
	('Django'),
	('PostgreSQL'),
	('MongoDB');
CREATE TABLE projects_technologies (
	"id" BIGSERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL,
	"projectId" INTEGER NOT NULL,
	"technologyId" INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY ("projectId") REFERENCES projects("id") ON DELETE CASCADE,
	FOREIGN KEY ("technologyId") REFERENCES technologies("id") ON DELETE DEFAULT
);