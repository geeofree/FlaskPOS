import $ from "jquery"
import ajax from "../misc/ajax"


export default function search(itemELCreator, $wrapper) {
  const $search = $('.search-input')
  const $select = $('.search-select')

  function resp_callback(resp) {
    resp.forEach(data => $wrapper.append(itemELCreator(data)))
  }

  function sendSearchQuery(query, callback) {
    ajax(query, '/search', callback)
  }

  function searchEvent() {
    const child = $wrapper.children()
    child.remove()

    const $filter = $('.search-filter :selected')
    const $scope  = $('.search-scope :selected')

    const $searchVal = $search.val()
    const $filterVal = $filter.val()
    const $scopeVal  = $scope.val()

    const search_query = {
      query: $searchVal,
      filter: $filterVal ? $filterVal : "prod_name",
      scope: $scopeVal ? $scopeVal : false
    }

    sendSearchQuery(search_query, resp_callback)
  }

  $select.change(searchEvent)
  $search.keyup(searchEvent)
}
