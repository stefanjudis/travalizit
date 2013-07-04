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

**options -** config options object **[ default: {} ]**

**options.host -** Change the travis API host, if you want **[ default: 'https://api.travis-ci.org/' ]**

**options.repoId -** Set a repository id to retrieve only information about a given repository **[ default: '' ]**

*Example:*

```
builds = travalizit.Builds( {
  repoId : '123456'
} );
```

### fetch builds

**Description:** Fetch build data from Travis.

```
builds.all( callback );
```

**callback -** callback function( error, response, body ) for error and response handling

*Example:*

```
builds.all( function( error, response boddy ) {
  // do something here
} );
```

