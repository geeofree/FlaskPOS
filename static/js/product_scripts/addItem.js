import $ from "jquery"
import openModal from "../misc/modal"
export { addItem, formEv }

const closeBtn = $('.close')

function addItem() {
  // MODAL
  const $addBtn      = $('.add')
  const $addModal    = $('.add-modal')

  openModal($addBtn, $addModal, modalEvent)
}

// MODAL EVENT
function modalEvent(modal, content) {
  // SHOW MODAL
  modal.addClass('active')
  content.addClass('active')

  // INPUTS
  const $itemName  = $('.item-name')
  const $itemCode  = $('.item-code')
  const $itemType  = $('.item-type')
  const $itemStock = $('.item-stock')
  const $itemPrice = $('.item-price')

  // BUTTONS
  const $submit = $('.submit')
  const $clear  = $('.clear')

  // MISC.
  const $form          = $('.add-inputs')
  const $contentInputs = content.find('input')


  $clear.click(function() {
    $itemName.val('')
    $itemCode.val('')
    $itemType.val('')
    $itemStock.val(0)
    $itemPrice.val(0)
  })

  closeBtn.click(function() {
    $('.active').removeClass('active')
    $contentInputs.val('')
    $itemStock.val(0)
    $itemPrice.val(0)
  })

  formEv($form, $submit, $itemName, $itemCode, $itemType, $itemStock, $itemPrice)
}


// FORM EVENT
function formEv($form, $btn, $name, $code, $type, $stock, $price) {
  const $sel  = $('select')

  $btn.on("click", function() {
    const $self = $(this)

    // INPUT VALUES
    const $nameVal  = $name.val()
    const $codeVal  = $code.val()
    const $typeVal  = $type.val()
    const $stockVal = $stock.val()
    const $priceVal = $price.val()

    if(validInputs($nameVal, $codeVal, $typeVal, $stockVal, $priceVal)) {
      $form.submit()
      $self.off("click")
    }
  })

  $sel.click(function() {
    const $self = $(this)
    const $selVal = $self.val()
    $type.val($selVal)
  })
}

// VALID INPUT FUNCTION
function validInputs(name, code, type, stock, price) {
  const maxDigit  = /\d{11}/
  const digitOnly = /^\d+$/

  const validName = Boolean(name) && name.length <= 140
  const validCode = Boolean(code) && maxDigit.test(code)
  const validType = Boolean(type) && type.length <= 25
  const validStock = Boolean(stock) && stock >= 0 && stock <= 999999 && digitOnly.test(stock)
  const validPrice = Boolean(price) && price >= 0 && stock <= 999999 && digitOnly.test(price)

  if(!validCode) {
    alert('Invalid ITEM CODE input')
    return false
  }
  else if(!validName) {
    alert('Product NAME must be more than 1 and less than 140 characters')
    return false
  }
  else if(!validType) {
    alert('Product CATEGORY must be more than 1 and less than 25 characters')
    return false
  }
  else if(!validStock) {
    alert('Invalid input on STOCK, must be 0 or more and less than 1,000,000')
    return false
  }
  else if(!validPrice) {
    alert('Invalid input on PRICE, must be 0 or more and less than 1,000,000')
    return false
  }

  return true
}
