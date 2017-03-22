import $ from "jquery"


export default function search($parent, sku, name, type) {
  const $search = $('.search-input')
  const $select = $('.search-select')
  const $filter = $('.search-filter')
  const $scope  = $('.search-scope')
  const $child  = $parent.children()

  function searchEvent(event) {
    const $searchVal = $search.val()
    const $filterVal = $filter.val()
    const $scopeVal  = $scope.val()

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

    if(!button) {
      searchEL($child, sku, name, type, query, 'change')
    }
  }

  $select.change(searchEvent)
  $search.keyup(searchEvent)
}


function searchEL($child, sku, name, type, query, evType) {
  const search = query.search
  const filter = query.filter
  const scope  = query.scope


  function pattern(matcher) {

    function escape(str) {
      const invalid = (/[[\\({^$?*+]/gi).test(str)
      console.log(invalid, str)
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

    function query_check(query, callee) {
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

    const name_check = (filter == "prod_name" || filter == null) && !pattern(itemName) && filter != itemName
    const code_check = filter == "prod_code" && !pattern(itemCode) && filter != itemCode

    const select_check = !(scope == "" || scope == null) && scope != itemType
    const def_sel_check = (scope == "" || scope == null) && scope != itemType
    const input_check = (name_check || code_check)

    if(evType == 'change') {
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
