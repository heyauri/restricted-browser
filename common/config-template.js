/**
 *  The configuration template that will be used to generate the configuration.
 */
module.exports = {
    /**
     * @param {boolean or string} - false-> will not set the proxy_server, otherwise set `address:port`
     */
    proxy_server: false,
    /**
     * @param {boolean or string} - false-> will not set the proxy_pac_url, otherwise set `http(s)://address`
     */
    proxy_pac_url: false,
    /**
     * @param {boolean or string} - false-> will not set the proxy_bypass_list, otherwise set like "<local>;*foo.com,*.google.com"
     */
    proxy_bypass_list: "<local>;",
    /**
     * @param {string} - The homepage of this browser
     */
    default_url: "http://www.qq.com",
    /**
     * @param {Array of Regex} - Those hosts do not match the Regex patterns will be block, hence all accessible urls should match at least one pattern
     */
    white_list_patterns: [/.*/],
    /**
     * @param {Array of Regex} - Those hosts match the Regex patterns will be block, hence all accessible url should not match all patterns below
     */
    black_list_patterns: [],
    /**
     * @param {Object} - Shown by dialog when a url is blocked (no matter by proxy mode or url pattern)
     */
    warning_dialog: {
        title: "Warning",
        message: "The target webpage is not allowed to be accessed.",
        show_configuration_path: true
    }
}
