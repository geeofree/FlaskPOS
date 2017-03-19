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
  else {
    alert('No item(s) in cart!')
  }

  $tendersub = $tendersub.text($totalVal)
  $tendersub = $tendersub.text()

  const totalAmount = Number($tendersub.match(/\d+/)[0])
  const payAmount   = Number($payment.val())

  calculateChange(totalAmount, payAmount)

  $payment.keydown(function(event) {
    const $self  = $(this)
    const button = event.which || event.button
    const keyVal = String.fromCharCode(button)

    if(!(button >= 48 && button <= 57 || button >= 96 && button <= 105 || button == 8
      || button == 37 || button == 39 || event.ctrlKey && button == 65)) {
      event.preventDefault()
    }
  })

  $payment.keyup(function(event) {
    const $self  = $(this)
    const $val   = $self.val()
    const button = event.which || event.button
    const keyVal = String.fromCharCode(button)

    if(keyVal !== " " && !isNaN(keyVal) || button == 8) {

      if($val < 0) {
        $self.val(0)
      }

      if($val > 999999) {
        $self.val(999999)
      }

      let value = Number($self.val())

      calculateChange(totalAmount, value)
    }
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
