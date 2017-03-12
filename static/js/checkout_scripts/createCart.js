import $ from 'jquery'
import createItem from './createCartItem'

export default function createCartItems(selectedItems, qty) {
  const $items = $('.items')

  selectedItems.each(function(_, el) {
    const $el    = $(el)
    const $stock = Number($el.find('.stock').text())

    const itemID    = $el.find('.id').text()
    const itemName  = $el.find('.name').text()
    const itemPrice = $el.find('.price').text()
    const itemStock = Number($el.find('.stock').text())

    const price     = Number(itemPrice.match(/\d+/)[0])
    const itemTotal = "₱" + (price * qty)
    let quantity = qty > itemStock ? itemStock : qty

    if($stock > 0) {
      createItem(itemID, itemName, itemPrice, quantity, itemTotal)
    }

    $el.removeClass('selected-product')
  })
}
