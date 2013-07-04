travalizit
==========

Node.js Travis API

Install
-----------

```
npm install travalizit
```


Builds API
-----------



### create a new builds object

**Description:** Create a new travalizit builds object.

```
var travalizit = require( 'travalizit' ),
    builds = ravalizit.Builds();
```

```
var travalizit = require( 'travalizit' ),
    builds = travalizit.Builds( options );
```
**options:** config options object **[ default: {} ]**

**options.host:** Change the travis API host, if you want **[ default: 'https://api.travis-ci.org/' ]**

**options.repoId:** Set a repository id to retrieve only information about a given repository **[ default: '' ]**

```
builds = travalizit.Builds( {
  repoId : '123456'
} );
```