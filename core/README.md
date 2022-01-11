# Getting started

1. Run `npm start` or `welly it` to start the builder CLI
2. Deploy the infrastructure using the CLI or running `welly full`
3. Redeploy code changes using the CLI or running `welly fast`

## Build

Welly expects a certain folder structure. Every serverless function should be in a directory under `src/`. Every folder
should have a `index.ts` file which serves as the entry point.

```
.
├── helloWorld
│   └── index.js
└── helloWorld2
    └── index.jss
```

The build resolves these directories into the output dir (`dist/` by default) and zip's them up. The name of the lambda
is assigned based on the directory name.

If there is just one function tho, the folder name becomes `lambda` as a workaround currently. Everything in the `lib/`
directory is bundled into the functions however is not resolved into a lambda itself.

## Deployment

Before running a successful deployment be sure to configure your IaC properly. For example when using any of to
terraform templates be sure to set the backed config.

### Full deploy

Running a full deployment, takes the script from `.wellyrc.json` under `full_deploy` and runs it. This is expected to
take longer as the full infrastructure is deployed.

### Fast deploy

Running a fast deployment, takes either the script from `.wellyrc.json` under `fast_deploy` and runs it or it takes the
config. The config object implies that a supported template is being used. This then proceeds to do a faster update of
just the function instead of the entire infrastructure.

### Known issues

1. If you have just one folder in `src` this builds out a single `index.js` and breaks the destination folder hierarchy.
   This then leads to the ZipPlugin silently failing and therefor the watchmode not working. To work around this just
   keep the example `helloWorld2` dir but don't publish it. Chances are you will need another Lambda endpoint anyways.