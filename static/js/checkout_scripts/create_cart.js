import $ from 'jquery'
import createItem from './create_cart_item'

export default function createCartItems(selected_items, qty) {
  selected_items.each(function(_,el) {
    const $el = $(el)
    const item_name = $el.children('.name').text()
    const price = $el.children('.price').text()
    const price_num =  Number(price.match(/\d+/)[0])
    const total = "₱" + (price_num * qty)

    createItem(item_name, price, qty, total)
    $el.removeClass('selected-product')
  })
}
