import $ from "jquery"
import { openModal, closeModal } from '../misc/modal'
import createItem from "./createCart"


export default function qtyModal($selected) {
  const smallest = smallestStockSelected($selected)
  const content = $('.quantity-modal')
  openModal(content, modalEvent)

  // MODAL EVENT
  function modalEvent(content, showModal) {
    const $qty = $('.qty-input')
    const $qtyBtn  = $('.confirm-qty')


    // SHOW MODAL
    showModal()

    // Helper function
    function closeEv() {
      $qtyBtn.off("click")
      $qty.off("change")
      $qty.val(1)
    }

    // QTY INPUT CHANGE EVENT HANDLER
    $qty.change(function() {
      const $self = $(this)
      const $val = Number($qty.val())

      if($val > smallest) {
        $self.val(1)
      }

      if($val < 1) {
        $self.val(smallest)
      }
    })

    // QTY BUTTON CLICK EVENT HANDLER
    $qtyBtn.click(function() {
      const qty = Number($qty.val())
      createItem($selected, qty)

      $('.active').removeClass('active')
      closeEv()
    })

    // CLOSE MODAL
    closeModal(closeEv)
  }
}



// HELPER FUNCTION
function smallestStockSelected($selected) {
  var smallest = 999999999

  $selected.each(function(_, data) {
    const $data     = $(data)
    const $stock    = $data.find('.stock')
    const $stockVal = Number($stock.text())

    if($stockVal < smallest) {
      smallest = $stockVal
    }
  })

  return smallest
}
