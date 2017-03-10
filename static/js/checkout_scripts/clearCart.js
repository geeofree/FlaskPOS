import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"


export default function clearCart() {
  const $clearBtn   = $('.clear')
  const $clearModal = $('.clear-modal')

  btnOpenModal($clearBtn, $clearModal, modalEvent)
}


function modalEvent(content, showModal) {
  // SHOW MODAL
  showModal()

  const $cancel  = $('.cancel')
  const $confirm = $('.confirm')
  const $items   = $('.items')

  $cancel.click(function() {
    const $self = $(this)
    $self.off("click")
    $('.active').removeClass('active')
  })

  $confirm.click(function() {
    const $self = $(this)
    emptyCart($items)
    $self.off("click")
    $('.active').removeClass('active')
  })

  // CLOSE MODAL
  closeModal()
}


function emptyCart($cart) {
  const $purchased = $('.purchased-item')

  $purchased.each((_, data) => {
    const $id  = $(data).find('.id').text()
    const $qty = Number($(data).find('.item-qty').text())

    const $product      = $('#no' + $id)
    const $productStock = $product.find('.stock')
    const $stock        = Number($productStock.text())

    $productStock.text($stock + $qty)

    if(!$product.hasClass('in-stock')) {
      $product.addClass('in-stock')
    }
  })

  $cart.empty()
}
