Installation
-----------------------

```shell
npm install -g site-diff
```

This package assumes you have phantomjs installed, and available in your path.
If that is not the case [follow their installation instructions](http://phantomjs.org/download.html).

Unless previously installed you'll _need_ __Cairo__. For system-specific installation view the [Wiki](https://github.com/Automattic/node-canvas/wiki/_pages).

You can quickly install the dependencies by using the command for your OS:

OS | Command
----- | -----
OS X | `brew install pkg-config cairo libpng jpeg giflib`
Ubuntu | `sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++`
Fedora | `sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel`
Solaris | `pkgin install cairo pkg-config xproto renderproto kbproto xextproto`
Windows | [Instructions on our wiki](https://github.com/Automattic/node-canvas/wiki/Installation---Windows)

**El Capitan users:** If you have recently updated to El Capitan and are experiencing trouble when compiling, run the following command: `xcode-select --install`. Read more about the problem [on Stack Overflow](http://stackoverflow.com/a/32929012/148072).


Usage
-----------------------

```site-diff [options] path1 path2```

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -d, --dimensions <size>  The dimensions to use for the viewport (default: 2550x1680) 
    -o, --output <output>    The directory to use to save the image files. (default: os.tmpdir())
    -p, --port <port>        The port to use for PhantomJS

