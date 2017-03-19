import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"
import { numInputValidation } from "../misc/misc"
import { ajax } from "../misc/ajax"


export default function tenderItems() {
  const $tenderBtn   = $('.tender')
  const $tenderModal = $('.tender-modal')

  btnOpenModal($tenderBtn, $tenderModal, modalEvent)
}

function modalEvent(content, showModal) {
  const $purchaseBtn = $('.purchase')
  const $purchased = $('.purchased-item')
  const $subtotal = $('#sub-total')
  const $payment  = $('.payment-value')
  let   $tendersub = $('.subtotal-value')
  const $totalVal = $subtotal.text()

  if($purchased.length > 0) {
    // SHOW MODAL
    showModal()
  }
  else {
    alert('No item(s) in cart!')
  }

  $tendersub = $tendersub.text($totalVal)
  $tendersub = $tendersub.text()

  const totalAmount = Number($tendersub.match(/\d+/)[0])
  const payAmount   = Number($payment.val())

  calculateChange(totalAmount, payAmount)

  numInputValidation($payment, function($input, event) {
    const $val   = $input.val()
    const button = event.which || event.button
    const keyVal = String.fromCharCode(button)

    if($val < 0) {
      $input.val(0)
    }

    if($val > 999999) {
      $input.val(999999)
    }

    let value = Number($input.val())

    calculateChange(totalAmount, value)
  })

  $purchaseBtn.click(function() {
    sendData($purchased)
  })

  // CLOSE MODAL
  closeModal(function() {
    $payment.off("keyup")
    $payment.off("keydown")
    $purchaseBtn.off("click")
  })
}


function calculateChange(totalAmount, payAmount) {
  const changeEL = $('.change-value')
  const change = payAmount - totalAmount

  changeEL.text("₱" + change)
}


function sendData($purchases) {

  $purchases.each((_, data) => {
    const $data = $(data)
    const $id = Number($data.find('.id').text())
    const $qty = Number($data.find('.item-qty').text())

    const ajaxData = {
      id: $id,
      qty: $qty
    }

    ajax(ajaxData, '/payment', function(data) {
      alert('Success!')

      setTimeout(function(){
        window.location.replace(data.url)
      }, 600)
    })
  })
}
