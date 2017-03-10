import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"

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

  $tendersub = $tendersub.text($totalVal)
  $tendersub = $tendersub.text()

  const totalAmount = Number($tendersub.match(/\d+/)[0])
  const payAmount   = Number($payment.val())

  calculateChange(totalAmount, payAmount)

  $payment.change(function() {
    const $self = $(this)
    const $val = Number($self.val())

    if($val < 0) {
      $self.val(999999)
    }

    if($val > 999999) {
      $self.val(0)
    }

    calculateChange(totalAmount, $val)
  })

  $purchaseBtn.click(function() {
    sendData($purchased)
  })

  // CLOSE MODAL
  closeModal(function() {
    $payment.off("change")
    $purchaseBtn.off("click")
  })
}


function calculateChange(totalAmount, payAmount) {
  const changeEL = $('.change-value')
  const change = totalAmount - payAmount

  changeEL.text("₱" + change)
}


function sendData($purchases) {
  const ajaxData = {id:0, qty: 0}

  $purchases.each((_, data) => {
    const $data = $(data)
    const $id = Number($data.find('.id').text())
    const $qty = Number($data.find('.item-qty').text())

    ajaxData.id = $id
    ajaxData.qty = $qty

    ajax(ajaxData)
  })
}

function ajax(data) {
  $.ajax({
     type: 'POST',
     url: '/payment',
     data: JSON.stringify(data),
     contentType: 'application/json',
     success: function(url) {
       window.location.replace(url)
     }
  });
}
