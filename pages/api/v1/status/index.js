import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();
  const databaseName = process.env.POSTGRES_DB;
  const dbStatus = await database.query({
    text: `SELECT 
      current_setting('server_version') AS server_version,
      current_setting('max_connections')::int AS max_connections,
      SUM(CASE WHEN datname = $1 THEN 1 ELSE 0 END)::int AS current_connections
    FROM 
        pg_stat_activity`,
    values: [databaseName],
  });

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: dbStatus.rows[0].server_version,
        max_connections: dbStatus.rows[0].max_connections,
        current_connections: dbStatus.rows[0].current_connections,
      },
    },
  });
}
export default status;
