import $ from "jquery"

function validInputs(name, code, type, stock, price) {
  const maxDigit  = /\d{11}/

  const validName = Boolean(name) && name.length <= 200
  const validCode = Boolean(code) && maxDigit.test(code)
  const validType = Boolean(type) && type.length <= 200
  const validStock = Boolean(stock) && stock >= 0 && stock <= 999999
  const validPrice = Boolean(price) && price >= 0

  if(!validCode) {
    alert('Invalid ITEM CODE input')
    return false
  }
  else if(!validName) {
    alert('Product NAME must be more than 1 and less than 200 characters')
    return false
  }
  else if(!validType) {
    alert('Product CATEGORY must be more than 1 and less than 200 characters')
    return false
  }
  else if(!validStock) {
    alert('Invalid input on STOCK, must be 0 or more and less than 1,000,000')
    return false
  }
  else if(!validPrice) {
    alert('Invalid input on PRICE, must be 0 or more')
    return false
  }

  return true
}

export default function addItem() {
  // INPUTS
  const $itemName  = $('.item-name')
  const $itemCode  = $('.item-code')
  const $itemType  = $('.item-type')
  const $itemStock = $('.item-stock')
  const $itemPrice = $('.item-price')

  // BUTTONS
  const $submit    = $('.submit')
  const $clear     = $('.clear')

  // FORM
  const $form = $('form')

  $submit.click(function() {
    // INPUT VALUES
    const $nameVal = $itemName.val()
    const $codeVal = $itemCode.val()
    const $typeVal = $itemType.val()
    const $stockVal = $itemStock.val()
    const $priceVal = $itemPrice.val()

    if(validInputs($nameVal, $codeVal, $typeVal, $stockVal, $priceVal)) {
      $form.submit()
    }
  })

  $clear.click(function() {
    $itemName.val('')
    $itemCode.val('')
    $itemType.val('')
    $itemStock.val(0)
    $itemPrice.val(0)
  })
}
