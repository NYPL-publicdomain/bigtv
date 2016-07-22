---
---

var pages = []
var started = false

const TRANSITION_DURATION = {{ site.transition_duration }}
const FADE_TRANSITION_DURATION = {{ site.fade_transition_duration }}

var fetchHeaders = new Headers();
fetchHeaders.append('pragma', 'no-cache');
fetchHeaders.append('cache-control', 'no-cache');

function loadPages() {
  fetch('{{ site.baseurl }}/pages.json', {
    method: 'GET',
    headers: fetchHeaders,
  })
    .then((response) => response.json())
    .then((newPages) => {
      console.log(`Data loaded: ${newPages.length} pages`)
      pages = newPages

      if (!started) {
        startBigTV()
      }
    })
    .catch((err) => console.log('parsing failed', err))
}

function startBigTV() {
  started = true

  var currentPage = 0
  var iframe = document.getElementById('iframe')
  var title = document.getElementById('title')
  var displayUrl = document.getElementById('display-url')
  var transition = document.getElementById('transition')

  function updatePage() {
    const page = pages[currentPage]

    if (!page) {
      currentPage = 0
      return
    }

    iframe.style.opacity = 0;
    transition.className = ''
    transition.style.width = 0;
    window.setTimeout(() => {

      iframe.src = page.url
      displayUrl.innerHTML = page.display_url
      title.innerHTML = page.title
      iframe.style.opacity = 1;
      transition.className = 'active'
      transition.style.width = '100%';
    }, FADE_TRANSITION_DURATION * 1000)

    currentPage = (currentPage + 1) % pages.length
  }

  function loadCommand() {
    var siteCodes = pages.map(function (page) { return page.code; })
    
    fetch('{{ site.command_api_endpoint }}?type=' + siteCodes.join(','), {
      method: 'GET',
      headers: fetchHeaders,
    })
      .then((response) => response.json())
      .then((command) => {
        if (command && command.action && siteCodes.indexOf(command.action) >= 0) {
          currentPage = siteCodes.indexOf(command.action)
          updatePage()
        }
      })
      .catch((err) => console.log('parsing failed', err))
  }

  window.setInterval(updatePage, TRANSITION_DURATION * 1000)
  updatePage()

  window.setInterval(loadCommand, 5 * 1000)
}



// Load new pages every minute
window.setInterval(loadPages, 60 * 1000)


loadPages()
