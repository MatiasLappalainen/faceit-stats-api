# Faceit stats api

This is a project for tracking personal [faceit](https://faceit.com) stats.

This is a repostory for the api and frontend can be found at: https://github.com/MatiasLappalainen/faceit-stats-client

> Note this is still a work in progress

## Running locally

With vscode debugger

- Create `.vscode/launch.json`
- Copy paste snippet below
- Run cp .env.example .env
- Add required env variables (see: [Env variables](#env-variable))

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "runtimeVersion": "16.14.0",
      "type": "node",
      "request": "launch",
      "name": "Launch api server",
      "program": "${workspaceFolder}/api/server.ts",
      "preLaunchTask": "tsc: build - api/tsconfig.json",
      "outFiles": ["${workspaceFolder}/api/dist/**/*.js"],
      "outputCapture": "std",
      "cwd": "${workspaceFolder}/api/dist",
      "envFile": "${workspaceFolder}/api/.env"
    }
  ]
}
```

- Run [vscode debugger](https://code.visualstudio.com/docs/editor/debugging)

- With command line
  ```bash
  DATABASE_CONNECTION_URL=<database_connection> PLAYER_ID=<player_id> FACEIT_TOKEN=<faceit_token> npm run start
  ```

## Env variables

| Variable                | Value                                                                     |
| ----------------------- | ------------------------------------------------------------------------- |
| USE_EXAMPLE_DATA        | (Required if no database) To use system without database connection       |
| DATABASE_CONNECTION_URL | (Required if no example data) PostgreSQL connection url                   |
| PORT                    | (Optional) Start server in specific port, default: 4242                   |
| PLAYER_ID               | (Required) Faceit playerId can be found from https://faceit.com           |
| FACEIT_TOKEN            | (Required) Faceit api token can be found at https://developers.faceit.com |
