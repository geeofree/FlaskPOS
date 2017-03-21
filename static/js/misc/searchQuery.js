import $ from "jquery"
import ajax from "../misc/ajax"


export default function search(itemELCreator, $wrapper) {
  const $search = $('.search-input')
  const $select = $('.search-select')
  const $filter = $('.search-filter')
  const $scope  = $('.search-scope')


  function resp_callback(resp) {
    resp.forEach(data => $wrapper.append(itemELCreator(data)))
  }

  function sendSearchQuery(query, callback) {
    ajax(query, '/search', callback)
  }

  function searchEvent(event) {
    const $searchVal = $search.val()
    const $filterVal = $filter.find(':selected').val()
    const $scopeVal  = $scope.find(':selected').val()

    const button = event.which || event.button
    const keyval = String.fromCharCode(button)
    const latin  = /\w|\s/.test(keyval)

    const search_query = {
      query: $searchVal,
      filter: $filterVal ? $filterVal : "prod_name",
      scope: $scopeVal ? $scopeVal : false
    }

    if(latin || ((button == 8 || button == 13) && $searchVal == "")) {
      const child = $wrapper.children()
      child.remove()
      sendSearchQuery(search_query, resp_callback)
    }
    else {
      event.preventDefault()
    }

    if(!button) {
      const child = $wrapper.children()
      child.remove()
      sendSearchQuery(search_query, resp_callback)
    }
  }

  $scope.change(searchEvent)
  $search.keyup(searchEvent)
}
