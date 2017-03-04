import $ from 'jquery'
import createCartItems from './create_cart'

export default function checkout() {
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
}
