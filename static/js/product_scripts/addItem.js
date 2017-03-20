import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"
import { numInputValidation, changeHandler } from "../misc/misc"
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
  const $itemCode  = $('.item-code')
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
    $itemCode.val('')
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

  formEv($form, $submit, $itemName, $itemCode, $itemType, $itemStock, $itemPrice, function() {
    alert('Product Add Success!')
  })
}


// FORM EVENT
function formEv($form, $btn, $name, $code, $type, $stock, $price, callback) {
  const $sel  = $('select')
  const $str_inputs = [[$name, 65], [$code, 11], [$type, 25]]
  const $num_inputs = [[$stock, 1, 999], [$price, 0, 999999]]

  // String Key Input Event Handler
  $str_inputs.forEach(input => {
    const $input = input[0]
    const max = input[1]

    inputLimiter($input, max)
  })

  // Number Input Validation for price and stock
  $num_inputs.forEach(input => {
    const $input = input[0]
    const min = input[1]
    const max = input[2]

    changeHandler($input, min, max)

    numInputValidation($input, (self, ev) => {
      const $val = Number(self.val())

      if($val > max) {
        self.val(max)
        return
      }

      if($val < min) {
        self.val(min)
        return
      }
    })

  })


  // Button Click Event Handler
  $btn.on("click", function() {
    const name = $name.val()
    const code = $code.val()
    const type = $type.val()

    if(code.length < 11 || code.length > 11) {
      alert('Invalid input on item code field')
    }
    else if(name.length < 1 || name.length > 65) {
      alert('Invalid input in name field')
    }
    else if(type.length < 1 || type.length > 25) {
      alert('Invalid input in category field')
    }
    else {
      if(callback) { callback() }
      $form.submit()
    }
  })

  // Select Element Click Event Handler
  $sel.change(function() {
    const $self = $(this)
    const $selVal = $self.val()
    $type.val($selVal)
  })
}
