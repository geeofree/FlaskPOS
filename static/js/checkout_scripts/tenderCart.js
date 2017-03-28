import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"
import { numInputValidation } from "../misc/misc"
import ajax from "../misc/ajax"


export default function tenderItems() {
  const $tenderBtn   = $('.tender')
  const $tenderModal = $('.tender-modal')

  btnOpenModal($tenderBtn, $tenderModal, modalEvent)
}

function modalEvent(content, showModal) {
  const $purchaseBtn = $('.purchase')
  const $purchased = $('.purchased-item')
  const $subtotal = $('#sub-total')
  const $qtytotal =  $('#sub-qty')
  const $payment  = $('.payment-value')
  const $totalVal = $subtotal.text()

  let $tendersub = $('.subtotal-value')

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
  const totalQty    = Number($qtytotal.text())
  const payAmount   = Number($payment.val())

  let change = 0
  let payment = 0

  change = calculateChange(totalAmount, payAmount)

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

    payment = Number($input.val())

    change = calculateChange(totalAmount, payment)
  })

  $purchaseBtn.click(function() {
    const $self = $(this)

    if(change < 0) {
      alert('Insufficient Pay Amount')
    }
    else {
      $self.off("click")
      sendData($purchased, totalAmount, totalQty, payment, change)
    }
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
  return change
}


function sendData($purchases, totalAmount, totalQty, payment, change) {
  const $merchant = $('.merchant').text()

  const data = {
    merchant: $merchant,
    subtotal: totalAmount,
    totalqty: totalQty,
    payment: payment,
    change: change,
    items_sold: []
  }

  $purchases.each((_, itemData) => {
    const $itemData = $(itemData)
    const $id = Number($itemData.find('.id').text())
    const $qty = Number($itemData.find('.item-qty').text())
    let $linetotal = $itemData.find('.item-total').text()
    $linetotal = Number($linetotal.match(/\d+/)[0])

    const item_data = {
      id: $id,
      qty_sold: $qty,
      linetotal: $linetotal
    }

    data['items_sold'].push(item_data)
  })

  ajax(data, '/payment', function(resp) {
    if(resp.status == 'success') {
      alert('success!')
      window.location.replace(resp.url)
    }
  })
}
