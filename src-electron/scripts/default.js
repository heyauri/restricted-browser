/**
 *  The inject script to target url
 */
//初始注入
export let init = function () {
  try {
    let oldXHROpen = window.XMLHttpRequest.prototype.open
    window.XMLHttpRequest.prototype.open = function (
      method,
      url,
      async,
      user,
      password,
    ) {
      this.addEventListener('load', function () {
        window.api.send('toMain', {
          source: 'childWindow',
          msg: 'xhrData',
          target: {
            url: this.responseURL,
            response: this.response,
            responseText: this.responseText,
            status: this.status,
          },
        })
        console.log('data: ' + this.responseText)
      })
      console.log('init success')
      return oldXHROpen.apply(this, arguments)
    }
  } catch (e) {
    console.error(e)
  }
}
