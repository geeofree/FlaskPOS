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
    removeItem($('.purchased-item'))
    $self.off("click")
    $('.active').removeClass('active')
  })

  // CLOSE MODAL
  closeModal()
}


function removeItem($item) {
  const $subtotal    = $('#sub-total')
  const $subqty      = $('#sub-qty')
  const $subtotalNum = $subtotal.text().match(/\d+/)[0]

  let oldTotal    = Number($subtotalNum)
  let oldQty      = Number($subqty.text())

  $item.each((_, data) => {
    const $data  = $(data)
    const $id    = $data.find('.id').text()
    const $qty   = Number($data.find('.item-qty').text())
    const $total = Number($data.find('.item-total').text().match(/\d+/)[0])

    const $product      = $('#no' + $id)
    const $productStock = $product.find('.stock')
    const $stock        = Number($productStock.text())

    if(!$product.hasClass('in-stock')) {
      $product.addClass('in-stock')
    }

    oldTotal -= $total
    oldQty -= $qty

    $subtotal.text(oldTotal)
    $subqty.text(oldQty)

    $productStock.text($stock + $qty)
    $data.remove()
  })
}
