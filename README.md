***Note that this repository is no longer maintained.***

# Sample Collection Database Molgenis App

**Sample Collection Database Molgenis App** is a Vue CLI application for [MOLGENIS software](https://github.com/molgenis) (tested on v. 8.4.5). It is a modified version of the [BBMRI-ERIC Biobank Explorer app](https://github.com/molgenis/molgenis-app-biobank-explorer) (v. 3.1.2) which was shared under the LGPL-3.0 License. The code published in this repository was used for the [Swedish COVID-19 Sample Collection Database](https://biobanks.covid19dataportal.se) between February and December 2021.

The original code of BBMRI-ERIC Biobank Explorer app has been modified in a *quick and dirty way* in order to build a version adapted to the local requirements (specifically, a different data model was used, part of the functionality was removed, page layouts have been changed, etc.). Note that by *'quick and dirty'* we mean that the present code contains some remnants of the original app code which are no longer used but have not yet been removed. The modifications were made by the [SciLifeLab Data Centre](https://github.com/ScilifelabDataCentre) team; the team of developers of the original BBMRI-ERIC Biobank Explorer app was not in any way involved in making these modifications.

Re-use of our code to deploy other similar databases is welcome as long as the license conditions are met (including for the original BBMRI-ERIC Biobank Explorer app). Importantly, we note that the code shared here comes with no guarantees that it works or that it works well.

## Components of the app

The app works on top of [MOLGENIS software](https://github.com/molgenis), and it is built with a particular data model in mind. The data model (contained in an Excel file) can be found in the `sample data/` folder of the repository. This data model consists of the following tables:

- scd_model_biobanks
- scd_model_collections
- scd_model_persons
- scd_model_material_types
- scd_model_disease_types
- etc.

To deploy a working instance of the database similar to [the one we run](https://biobanks.covid19dataportal.se), you need to:

1. have a running MOLGENIS instance (tested using version 8.4.5);
2. build the Sample Collection Database app as described below, upload it through the admin panel of MOLGENIS ('Plugins' -> 'App manager'), and activate the app;
3. import the Excel file with the data model (and possibly your data) through the admin panel of MOLGENIS ('Import data' -> 'Advanced data import') .

If the data model is modified, you need to make corresponding modifications in the app code as the code directly refers to particular table and field names in the data model.

Data can be added into the database by including it in the Excel file of the data model or by being manually added through the admin panel of MOLGENIS ('Navigator' -> 'scd_model' -> 'Biobanks'/'Collections'/'Persons' etc.).

Please [see MOLGENIS documentation](https://www.molgenis.org) for all questions regarding deploying MOLGENIS and its functionality.

## Contributing and re-using the code

There are 2 ways to test and develop apps for MOLGENIS.

- locally without MOLGENIS
- locally with MOLGENIS

### Test locally without a running MOLGENIS instance

When developing and executing the code of the app in the local environment, it connects to an existing instance of MOLGENIS in order to find data to render. In the particular case of this app, it makes a proxy connection to https://biobanks.covid19dataportal.se. This can be changed in the file `vue.config.js`, in the following line:

```javascript
const PROXY_TARGET = 'https://biobanks.covid19dataportal.se/'

```

For local testing you can execute the following commands:

```bash
# To install the application
yarn install

# To run develop mode
yarn serve
```

It will render a local version of the core variable catalogue.

### Test with a running MOLGENIS instance
For local testing with a running MOLGENIS instance you have to alter the config of the app:

Comment in the following block

```config/index.js```

```javascript
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // Beginning of block
    proxyTable: {
      '/login': {
        target: 'http://localhost:8080'
      },
      '/plugin/directory/export': {
        target: 'http://localhost:8080'
      },
      '/api': {
        target: 'http://localhost:8080'
      }
    },
    // End of block
```

And comment out this block in the same file.


```javascript
/**
 * GET and POST interceptors
 * Removes the need for a running backend during development
 */
No mock data available
```

That is it. Run a molgenis instance on localhost:8080 and start the core variable catalogue with:

```javascript
yarn dev
```

## Build your MOLGENIS app

You can now create a working application that can be imported in MOLGENIS directly, by executing:

```bash
yarn build
```

You can find the zip-file in the ```dist/scd.zip```.

See also: [MOLGENIS app developement documentation](https://molgenis.gitbooks.io/molgenis/content/developer_documentation/app-development.html)

## Create a docker image | Molgenis Dev Team
To make a standalone docker image that can be run from the Rancher Cluster perform the following steps:

```
yarn build:preview
```

Then build the image with Docker (you have to have Docker running) with the following (tag is required):

```
docker build -t {tag} .
```

Then login to the registry

```
docker login {registry-adress}:{port}

```

Create a registry tag for the image

```
docker tag {tag} {registry-adress}:{port}/{imagename}:{optional tag}
```

Then upload the image to the registry
(now you need the tag)

```
docker push {registry-adress}:{port}/{imagename}:{optional tag}
```

Now it's available from Rancher.

Go to Rancher, select correct cluster

* workloads > deploy
* Name > name for your workload
* image > {registry-adress}/{imagename}:{optional tag}
* select correct namespace
* Add port > portname: http, publish port: 80, as a: cluster-ip
* env variable: API {molgenis instance you want e.g. molgenis1}
* launch

* workloads > loadbalancing
* add ingress
* website name {description}
* specify hostname: {logicalname}.dev.molgenis.org
* path /, target your created workload, port 80
* save

Done!
