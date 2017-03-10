import $ from 'jquery'
import createItem from './createCartItem'

export default function createCartItems(selectedItems, qty) {
  const $items = $('.items')

  selectedItems.each(function(_,el) {
    const $el = $(el)
    const itemID    = $el.children('.id').text()
    const itemName  = $el.children('.name').text()
    const itemPrice = $el.children('.price').text()
    const price     = Number(itemPrice.match(/\d+/)[0])
    const itemTotal = "₱" + (price * qty)

    createItem(itemID, itemName, itemPrice, qty, itemTotal)
    $el.removeClass('selected-product')
  })
}
