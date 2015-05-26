# goslash

Editable custom shortlinks.

## Running on localhost

1. `$ DEBUG=goslash:* node ./bin/www`
2. http://localhost:3000/

For more production-like localhost development:

1. Add the following to your `/etc/hosts`:

   ```
   # For local goslash development.
   127.0.0.1 golocal
   ```

2. `$ sudo PORT=80 DEBUG=goslash:* node ./bin/www`
3. http://golocal/

## TODO

* Edit/delete.
* Link stats. URL history with clicks per url.
* Paging for current links.
* Search.
* In the case of a slug 404, ask for a URL.
