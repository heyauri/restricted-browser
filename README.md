<h2 align="center">
  Restricted-Browser
  <br>
  <br><img src="./src-electron/icons/icon.png" alt="Restricted-Browser" width="80">
  <br>
</h2>

An electron-based web browser that can only access the associated web page according to the preset configuration.

## Usage

After installing the web browser, a configuration file is automatically created in the `userData` directory (depending on the platform).

- `%APPDATA%` on Windows
- `$XDG_CONFIG_HOME` or `~/.config` on Linux
- `~/Library/Application Support` on macOS

There is a configuration file called `config.js` in the `${userData}/rebr-config` directory.

Changing the configuration will update the browser's web page restrictions accordingly (after the browser has been restarted, of course).

Let's have a look at the configuration:

There are several ways to restrict the browser's access to web pages.

#### 1. `proxy_server` + `proxy_bypass_list`
This is a tricky way to restrict browser access, by setting a proxy server address that is not actually accessible, for example `http://localhost:12345`, all requests that do not match the pattern in the `Proxy Bypass List` will be redirected to such an unreachable proxy server (and then dropped).

The restriction of this method is simple and strong. However, some requests from the authenticated site may be blocked by the browser because they may have a different hostname that is not in the bypass list, such as the `cdn` files and `iframe`.

#### 2. `proxy_pac_url`
By setting the `proxy_pac_url` property, the browser will follow the proxy rules specified by the external PAC file. In general, the pac file should be served from a http address like `http://192.168.123.123:12345/pac.js`.

#### 3. `while_list_pattern` and `black_list_pattern`
Both `while_list_pattern` and `black_list_pattern` should be an array of Regular Expression patterns. Only the hostname of the request match at least one pattern in `while_list_pattern` and none of the patterns in `black_list_pattern` will be passed, otherwise it will be ignored.



## For DEV
### Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
npm run dev
```

### Build the app for production
```bash
npm run build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

### NEVER update the Electron version unless be compatible with window 7 is unnecessary!
