/**
 *  The configuration template that will be used to generate the configuration.
 *
 *  warning: the proxy related settings will be applied on all sites
 */
module.exports = {
    /**
     * @param {Object} - to mark whether the
     */
    version: 1,
    title: "Restricted Browser",
    homepage_setting: {
        title: "Welcome",
        description: "Welcome",
        instruction: {
            title: "instruction",
            toggle_label: "Show Instruction",
            chats: [
                { name: "User", avatar: "unicorn_1.png", messages: ["Hey Chatgpt!", "How to use this app?"], sent: true },
                {
                    name: "App",
                    avatar: "unicorn_5.png",
                    messages: ["It is quite easy!", "You can directly click the link below and access the associated webpage under the preset manner."],
                    sent: false,
                },
            ],
        },
        link_title: "Links",
    },
    /**
     * @param {Object} - Shown by dialog when a url is blocked (by proxy mode or url pattern)
     */
    warning_dialog: {
        title: "Warning",
        message: "The target webpage is not allowed to be accessed.",
        show_configuration_path: true,
        close_triggered_window: true,
    },
    /**
     * Setting of the browser window
     */
    browser_window: {
        minimizable: true,
    },
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
     * @param {list<Object>} - all accessible sites that will be shown on home page of the app.
     */
    accessible_sites: [
        {
            name: "qq",
            /**
             * @param {string} - The path of this site, and this path is considered as an accessible site by default
             */
            path: "http://www.qq.com",
            /**
             * @param {Array of Regex} - Those hosts do not match the Regex patterns will be blocked, hence all accessible urls should match at least one pattern
             */
            white_list_patterns: [/.*/],
            /**
             * @param {Array of Regex} - Those hosts match the Regex patterns will be blocked, hence all accessible urls should not match any patterns below
             */
            black_list_patterns: [],
        },
        {
            name: "baidu",
            /**
             * @param {string} - The path of this site
             */
            path: "http://www.baidu.com",
            /**
             * @param {Array of Regex} - Those hosts do not match the Regex patterns will be blocked, hence all accessible urls should match at least one pattern
             */
            white_list_patterns: [/.*baidu.*/],
            /**
             * @param {Array of Regex} - Those hosts match the Regex patterns will be blocked, hence all accessible urls should not match any patterns below
             */
            black_list_patterns: [],
        },
    ],
};
