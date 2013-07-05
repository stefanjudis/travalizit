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

**Description:** Create a new travalizit builds object. Make sure you set either repoId or name and owner, if not the return will be false.

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

**options.repoId -** Set a repository id to retrieve information about it **[ default: undefined ]**

**options.owner -** Set the repository owner to retrieve information about it **[ default: undefined ]**

**options.name -** Set the repository name to retrieve information about it **[ default: undefined ]**


*Example:*

```
builds = travalizit.Builds( {
  repoId : '123456'
} );
```

```
builds = travalizit.Builds( {
  owner : 'stefanjudis',
  name  : 'travalizit
} );
```

```
builds = travalizit.Builds( {} ); // false
```

### fetch builds

**Description:** Fetch build data from Travis.

```
builds.all( callback );
```

**callback -** callback function( error, response, body ) for error and response handling

*Example:*

```
builds.all( function( error, response, body ) {
  // do something here
} );
```

