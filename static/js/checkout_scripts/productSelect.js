import $ from "jquery"
import createCartItems from './createCart'
import { scrollbar } from '../misc/misc'
import qtyModal from "./qtySelect"


export default function productSelect() {
  const $products = $('.products')
  const $items    = $('.items')
  const $body     = $("body")

  // Body Key Event Helper Function
  function bodyKeyEvent($body) {
    const bodyEvents = $._data(document.body, "events")
    const hasEventKeyUp = bodyEvents ? bodyEvents.keyup.length : false

    if(!hasEventKeyUp) {
      $body.keyup(keyEvent)
    }

    // KEY EVENT Handler
    function keyEvent(event) {
      const button = event.which || event.button
      const $selected = $('.selected-product')

      if(button == 13) {
        createCartItems($selected, 1)
        scrollbar($items)
      }

      if(button == 32) {
        event.preventDefault()
        const qty = qtyModal($selected)
      }

      if($('.selected').length < 1) {
        $body.off("keyup")
      }
    }

  }

  // CLICK EVENT
  function clickEvent() {
    const $self = $(this)


    if($self.hasClass('in-stock')) {

      if($self.hasClass('selected-product')) {
        $self.removeClass('selected-product')
      }
      else {
        $self.addClass('selected-product')
      }

      if($('.selected-product').length > 0) {
        bodyKeyEvent($body)
      }

    }
  }

  $products.on("click", ".product", clickEvent)
}
