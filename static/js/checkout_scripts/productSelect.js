import $ from "jquery"
import createCartItems from './createCart'
import qtyModal from "./qtySelect"


export default function productSelect() {
  const $product = $('.product')
  const $body    = $("body")

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

  $product.click(clickEvent)
}
