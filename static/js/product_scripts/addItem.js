import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"
import { numInputValidation } from "../misc/misc"
import ajax from "../misc/ajax"
import inputLimiter from "../misc/inputTextLimiter"
export { addItem, formEv }


function addItem() {
  // MODAL
  const $addBtn      = $('.add')
  const $addModal    = $('.add-modal')

  btnOpenModal($addBtn, $addModal, modalEvent)
}

// MODAL EVENT
function modalEvent(content, showModal) {
  // SHOW MODAL
  showModal()

  // INPUTS
  const $itemName  = $('.item-name')
  const $itemType  = $('.item-type')
  const $itemStock = $('.item-max-stock')
  const $itemPrice = $('.item-price')

  // BUTTONS
  const $submit = $('.submit')
  const $clear  = $('.clear')

  // MISC.
  const $form          = $('.add-inputs')
  const $contentInputs = content.find('input')

  // Clear Event Handler
  $clear.click(function() {
    $itemName.val('')
    $itemType.val('')
    $itemStock.val(1)
    $itemPrice.val(0)
  })

  // Close Modal Event Handler
  closeModal(function() {
    $contentInputs.val('')
    $itemStock.val(1)
    $itemPrice.val(0)
    $submit.off("click")
  })

  formEv($form, $submit, $itemName, $itemType, $itemStock, $itemPrice, (stock, data) => {
    const stockValid = {min: 1, max: 999}

    if(stock < stockValid.min || stock > stockValid.max) {
      alert('Invalid stock value. Must be >= 1 and < 1,000')
      return false;
    }

    return {data, route: '/add_product'};
  })
}


// FORM EVENT
function formEv($form, $btn, $name, $type, $stock, $price, callback) {
  const $sel  = $('select')
  const $str_inputs = [[$name, 65], [$type, 25]]

  numInputValidation($stock)
  numInputValidation($price)

  // String Key Input Event Handler
  $str_inputs.forEach(input => {
    const $input = input[0]
    const max = input[1]

    inputLimiter($input, max)
  })


  // Button Click Event Handler
  $btn.on("click", function() {
    const name  = $name.val()
    const type  = $type.val()
    const price = $price.val()
    const max_stock = $stock.val()

    const priceValid  = {min: 1, max: 999999}
    const whiteSpace  = /\s{2,}|\n/.test(name)
    const priceFormat = /^(\d+\.\d{1,2})$|^\d+$/.test(price)

    const data = {name, type, max_stock, price}

    if(whiteSpace || name.length < 1 || name.length > 65) {
      alert('Invalid input in name field')
    }
    else if(type.length < 1 || type.length > 25) {
      alert('Invalid input in category field')
    }
    else if(priceFormat && (price < priceValid.min || price > priceValid.max)) {
      alert('Invalid price value. Must be >= 1 and < 1,000,000')
    }
    else {
      const valid = callback(max_stock, data)
      if(valid) { sendData(valid.data, valid.route) }
    }
  })

  // Select Element Click Event Handler
  $sel.click(function() {
    const $self = $(this)
    const $selVal = $self.val()
    $type.val($selVal)
  })
}


function sendData(data, route) {
  function response(resp) {
    if(resp.status != 'fail') {
      alert(resp.status)
      window.location.replace(resp.url)
    }
    else {
      alert(resp.error)
    }
  }

  ajax(data, route, response)
}
