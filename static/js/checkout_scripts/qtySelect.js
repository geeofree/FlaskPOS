import $ from "jquery"
import { openModal, closeModal } from '../misc/modal'
import { numInputValidation } from '../misc/misc'
import createItem from "./createCart"


export default function qtyModal($selected) {
  const largest = largestStockSelected($selected)
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
      $qty.off("keydown")
      $qty.off("keyup")
      $qty.val(1)
    }

    // QTY INPUT CHANGE EVENT HANDLER
    $qty.change(function() {
      const $self = $(this)
      const $val = Number($qty.val())

      if($val > largest) {
        $self.val(1)
      }

      if($val < 1) {
        $self.val(largest)
      }
    })

    // QTY INPUT KEYUP/KEYDOWN EVENT HANDLER
    numInputValidation($qty, function($input) {
      const $val = Number($input.val())

      console.log($val)

      if($val > largest) {
        $input.val(largest)
      }

      if($val < 1) {
        $input.val(1)
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
function largestStockSelected($selected) {
  var largest = 0

  $selected.each(function(_, data) {
    const $data     = $(data)
    const $stock    = $data.find('.stock')
    const $stockVal = Number($stock.text())

    if($stockVal > largest) {
      largest = $stockVal
    }
  })

  return largest
}
