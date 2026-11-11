# Getting started

## Requirements

- Node.js 24 or newer.
- No npm dependencies need to be installed.
- A modern browser for the website preview.

## Run the source project

1. Copy `.env.example` to `.env` if you want to set branding, theme, or local server options.
2. Run `npm start` from the project directory.
3. Open `http://127.0.0.1:4173`.

On Windows, `Start WillowCraft.bat` starts the local server and opens the browser. Keep its terminal window open until you stop previewing the site.

## Create a deployment bundle

These build/package commands are for the full source project. If you received `WillowCraft-Deploy.zip`, it already contains the built runtime; skip this step and follow [Deployment](DEPLOYMENT.md).

Run to create the deployable directory:

```sh
npm run build
```

The command recreates `dist/` with only the runtime files, public assets, `.env.example`, and documentation. It does not compile/minify source because the frontend is already browser-ready and there is no bundler. The generated directory can be uploaded directly to a Node.js host.

On Windows, run `npm run package` to build and create `WillowCraft-Deploy.zip` in one step. For other systems, create a ZIP from the contents of `dist/`, ensuring hidden files such as `.env.example` are included.
