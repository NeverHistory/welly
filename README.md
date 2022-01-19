# Welly 🥾 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/facebook/create-react-app/blob/main/CONTRIBUTING.md)

Create a serverless REST Api backend system in minutes with

- minimal configuration
- fast development cycles
- an opinionated way of building modern backend systems

Welly currently works on macOS and Linux. Windows has not been tested yet.
> "[Give it some welly](https://en.wiktionary.org/wiki/give_it_some_welly)"

# Creating an App

**You'll need to have Node 14 or higher.** We recommend using [Terraform](https://www.terraform.io/#)
and [AWS](https://portal.aws.amazon.com/billing/signup/iam)

## npx

```npx welly```

## npm

```welly```

Welly will walk you through a series of questions to get you started. This will create a project with a
seperate `README.md` file that we recommed reading.

# .wellyrc.json

Welly offers a certain degree of configuration however at its core we made a few assumptions about the way you will
work. Most of these properties in `.wellyrc.json` will get populated by our supported templates. Welly
requires `.wellyrc.json` to be part of the directory where you run all your welly commands specific to building and
deploying.

### deployDir

This is the directory where you store your infrastructure code.

### fullDeploy

This is the command that is being ran when you do a full deployment

### fastDeploy

This is either a string with your custom command to run on a fast deployment, or a configuration object that works with
one of our supported tempaltes.

### build

TBA

### commands

An object of custom shortcut commands to use in the cli in case you require something extra like for example you want to
run `eslint` without having to have another window to run this in.

# Future outlook

## Dev vs Prod env

Currently, there is not a difference. It would be nice to have different configs for one or the other

## Build config

There is the option to pass the esbuild in the `.wellyRC.json` as the interface expects it, however currently that does
not do anything.

# License

Welly is open source software licensed as MIT. 