var pages = []
var started = false

const TRANSITION_DURATION = 20

// Load new pages every minute
window.setInterval(loadPages, 60000)

function loadPages() {
  fetch('../pages.json')
    .then((response) => response.json())
    .then((newPages) => {
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

  function updatePage() {
    const page = pages[currentPage]

    if (!page) {
      return
    }

    iframe.style.opacity = 0;
    window.setTimeout(() => {
      iframe.src = page.url
      displayUrl.innerHTML = page.display_url
      title.innerHTML = page.title
      iframe.style.opacity = 1;
    }, 2000)

    currentPage = (currentPage + 1) % pages.length
  }

  window.setInterval(updatePage, TRANSITION_DURATION * 1000)
  updatePage()
}

loadPages()
