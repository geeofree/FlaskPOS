import $ from "jquery"
import { scrollbar } from "./misc"

export default function search($parent, sku, name, type) {
  const $search = $('.search-input')
  const $select = $('.dropdown-option')
  const $filter = $('.search-filter')
  const $scope  = $('.search-scope')
  const $child  = $parent.children()

  function searchEvent(event) {
    const $self = $(this)

    console.log($self.hasClass('search-input'))

    if(!$self.hasClass('selected-query') && !$self.hasClass('search-input')) {
      $self.parent('.dropdown-content').find('.selected-query').removeClass('selected-query')
      $self.addClass('selected-query')
    }

    $self.parent('.dropdown-content').removeClass('show-dropdown')

    const $searchVal = $search.val()
    const $filterVal = $filter.find('.selected-query').text()
    const $scopeVal  = $scope.find('.selected-query').text()

    const button = event.which || event.button
    const keyval = String.fromCharCode(button)
    const latin  = /\w|\s/.test(keyval)

    const query = {
      search: $searchVal,
      filter: $filterVal,
      scope: $scopeVal
    }

    if(latin || button == 8) {
      searchEL($child, sku, name, type, query, 'keyup')
    }

    if(button) {
      searchEL($child, sku, name, type, query, 'click')
    }

    scrollbar($parent)
  }

  $select.click(searchEvent)
  $search.keyup(searchEvent)
}


function searchEL($child, sku, name, type, query, evType) {
  const search = query.search
  const filter = query.filter
  const scope  = query.scope

  function pattern(matcher) {

    function escape(str) {
      const invalid = (/[[\\({^$?*+]/gi).test(str)
      return invalid ? "\\" + str : str
    }

    const value = search.split('').map(str => escape(str)).join('')
    const match = new RegExp(`^${value}`, 'gi')
    return match.test(matcher)
  }

  $child.each((_, item) => {
    const $item = $(item)
    const itemCode  = $item.find(sku).text()
    const itemName  = $item.find(name).text()
    const itemType  = $item.find(type).text()

    function query_check(query) {
      if(query) {
        if($item.hasClass('hide')) {
          $item.removeClass('hide')
        }

        $item.addClass('hide')
      }
      else {
        $item.removeClass('hide')
      }
    }

    const name_check = (filter == "Name" || filter == null) && !pattern(itemName) && filter != itemName
    const code_check = filter == "SKU" && !pattern(itemCode) && filter != itemCode

    const select_check = !(scope == "" || scope == "All") && scope != itemType
    const def_sel_check = (scope == "" || scope == "All") && scope != itemType
    const input_check = (name_check || code_check)

    if(evType == 'click') {
      if((!select_check || select_check) && !input_check) {
        query_check(select_check)
      }
    }
    else if(evType == 'keyup') {
      if(!select_check && (input_check || !input_check)) {
        query_check(input_check)
      }

      if(def_sel_check) {
        query_check(input_check)
      }
    }

  })
}
