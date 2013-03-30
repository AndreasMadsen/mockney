#mockney

> Mock TCP connection by redirecting them

## Installation

```sheel
npm install mockney
```

## Documentation

`mockney` redirects TCP connection to another host and port. This enables you
to mock http, https, tls and tcp requests in a simple way, there is very close
to a real world connection.

```javascript
var mockney = require('mockney');
```

### mockney.redirect(from, to)

The `redirect` method will redirect form a hostname to another hostname. It is
important to specify both host and port and never the protocol.

Note that you can apply multiply rules to the same hostname, the last applied
rule will be what is used.

```javascript
mockney.redirect('google.com:80', 'localhost:8080');
```

### mockney.restore(from)

The `restore` method will remove the redirect rule, by previous given `from`
hostname.

Note that it is safe to restore hostnames where no rules exists, this will
simply not do anything.

```javascript
mockney.restore('google.com:80');
```

##License

**The software is license under "MIT"**

> Copyright (c) 2013 Andreas Madsen
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
