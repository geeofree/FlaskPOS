function createCartItems(selected_items, qty) {
  selected_items.each(function(_,el) {
    const $el = $(el)
    const item_name = $el.children('.name').text()
    const price = $el.children('.price').text()
    const price_num =  Number(price.match(/\d+/)[0])
    const total = "₱" + (price_num * qty)

    createItem(item_name, price, qty, total)
    $el.removeClass('selected-product')
  })


  function createItem(item_name, price, qty, total) {
    const items = $('.items')
    const item_data = [[item_name, "long prod_name"], [price,"short"], [qty,"short"], [total,"short"]]

    const item = document.createElement('div')
    item.setAttribute("class", "purchased-item")

    item_data
    .map(data => {
      const value = data[0]
      const span_class = data[1]

      const span = document.createElement('span')
      const span_val = document.createTextNode(value)

      span.setAttribute("class", span_class)
      $(span).append(span_val)

      return span
    })
    .forEach(span => {
      $(item).append(span)
    })

    items.append(item)
  }
}


(function() {
  // FILTER SELECT
  (function() {
    const $choice = $('.choice')

    function clickEvent() {
      const $filtered = $('.current-filter')
      const $current = $(this)

      if(!$current.hasClass('current-filter')) {
        $filtered.removeClass('current-filter')
        $current.addClass('current-filter')
      }
    }
    $choice.click(clickEvent)
  })()


  // PRODUCT SELECT
  ;(function() {
    const $product = $('.product')

    function clickEvent() {
      const $self = $(this)

      if($self.hasClass('selected-product')) {
        $self.removeClass('selected-product')
      }
      else {
        $self.addClass('selected-product')
      }
    }
    $product.click(clickEvent)
  })()

  // ADD ITEM LIST
  ;(function() {
    const $products = $('.products')

    function keyEvent(event) {
      const button = event.which || event.button

      if(button == 13) {
        const $selected = $('.selected-product')
        createCartItems($selected, 2)
      }
    }

    function addKeyEvent() {
      const $body = $("body")
      $body.keyup(keyEvent)
    }

    function removeKeyEvent() {
      const $body = $("body")
      $body.off("keyup")
    }

    $products.mouseenter(addKeyEvent)
    $products.mouseleave(removeKeyEvent)
  })()
})()
