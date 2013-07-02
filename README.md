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



### create a new travalizit builds object

**Description:** Create a new travalizit builds object.

```
var Travalizit = require( 'travalizit' ),
    builds = new Travalizit.builds();
```

```
var Travalizit = require( 'travalizit' ),
    builds = new Travalizit.builds( options );
```
**options:** config options object **[ default: {} ]**

**options.host:** Change the travis API host, if you want **[ default: 'https://api.travis-ci.org/' ]**

**options.repoId:** Set a repository id to retrieve only information about a given repository **[ default: '' ]**

```
builds = new Travalizit.builds( {
  repoId : '123456'
} );
```