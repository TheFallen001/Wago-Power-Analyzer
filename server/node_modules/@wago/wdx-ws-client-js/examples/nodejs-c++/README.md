# WDX - WS - Client - JS - Examples - C++ Integration

C++ projects integration example with a WDX IoT Server and WDX - WS - Client - JS package.

In this example we will:

1. Connect IoT device to [WDX - IoT Server](https://ccc100.elrest.gmbh/ccc100wiki/wdx-about-wdx.html)

2. Subscribe to the WDX IoT Server Data Schema value of the input variable with [WDX - WS - Client - JS package](https://github.com/elrest-cz/wdx-ws-client-js).

3. Calculate output value with [C++ library NodeJS bindings](https://nodejs.org/api/n-api.html) ouput value when input is changed and update output WDX Data Value on IoT Device.


## Table of Contents

- [Requirements](#requirements)
- [Usage](#examplec++-wdx-project)
  - [Install Requirements](#install-requirements)
  - [Download Example project](#download-example-project)
  - [Run Example](#run-example)
- [Step By Step Guide](#step-by-step-guide)
- [APIs](#apis)
- [License](#license)


## Requirements

+ WDX IoT Server is required
+ nodejs version 18.18.2 or higher is required.
+ python version 3 or higher is required.
+ pip version 23.3.2 or higher is required.

## Example

This example shows how to integrate C++ library into NodeJS project and communicate with IoT devices connected to WDX IoT server.

See example C++ project [source code](https://github.com/elrest-cz/wdx-ws-client-js/blob/master/examples).Download it as zip from github and use directly following next instruction, or follow the [Step By Step Guide](#step-by-step-guide) to create it from scratch. 

For navive C++ project use [WDX - WS - Client - Cplus](https://github.com/elrest-cz) library.


The goal of the example is to integrate C++ library providing some interface, which you can involve in your NodeJS project with established communication to WDX IoT server.

WDX IoT server will provide you abstract Web Socket (WS) interface to communicate with Iot devices thrue the WDX Data IoT aggregation and provide you solid WS interface for manipulation with IoT devices(s).

WDX - WS - Client - JS library is typescript library which will be used to communicate with WDX IoT Server in your NodeJS project.

### Install requirements

### Download example project

### Run example

### Run on client OS

### Run in Docker

## Step by Step Guide

This instructions helps you to run full example on OS Client environment or in docker from scratch.


### Requirement Installations

Follow the instruction above in [Install Requirements](#install-requirements).

### Create a project directory

Create a new directory for your project:

```bash
mkdir c++-wdx
```

and navigate to it in your terminal

```bash
cd c++-wdx
```


### Initialize a new NodeJS project

Initialize a new Node.js project using npm or yarn:

```bash
npm init
```

or

```bash
yarn init
```


### Install WDX - WS - Client - JS Package

To install the WDX - WS - Client - JS package, use npm or yarn:

```bash
npm install @wago/wdx-ws-client-js
```

or

```bash
yarn add @wago/wdx-ws-client-js
```


### Create WDX - IoT Data connection

WDX will provide IoT data and we will be able to communicate IoT device within this example to use in your C++ NodeJS bindings.

In these example we will use WDX Data Virtual Store instance to simulate WDX IoT data in SQLite tree database.

//create instance



### Create WDX - IoT Data Schema

    //create schema
    //test-input
    //test-output


// subscribe test-input value

    // call napi call c++ function
    // update value test-output


## APIs

+ [WDX - Schema](https://github.com/elrest-cz/wdx-schema/blob/master/docs/modules.md)
+ [WDX - WS - Client - JS](https://github.com/elrest-cz/wdx-ws-client-js/blob/master/docs/modules.md)


## License

This library is licensed under the [MIT License](https://en.wikipedia.org/wiki/MIT_License). See the [LICENSE.md](https://github.com/elrest-cz/wdx-ws-client-js/blob/master/LICENSE.md) file for more details.

© 2024 Elrest Automations Systeme GMBH

This `README.md` provides a clear introduction to the TypeScript model schema library, with examples of how to use it, and includes the required copyright and licensing information under the MIT License.