import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"
import { formEv } from "./addItem"


export default function updateItem() {
  const $editBtn     = $('.edit')
  const $editModal   = $('.update-modal')

  btnOpenModal($editBtn, $editModal, modalEvent)
}


// MODAL EVENT
function modalEvent(content, showModal) {
  const $selected      = $('.selected')
  const $selData       = $($selected[0])
  const $contentInputs = content.find('input')


  if($selected.length == 0) {
    alert('ERROR: No item selected to update')
    return
  }

  // Column Data
  const $dataID    = $selData.find('.invID').text()
  const $dataName  = $selData.find('.data-name').text()
  const $dataCode  = $selData.find('.data-sku').text()
  const $dataType  = $selData.find('.data-type').text()
  const $dataStock = $selData.find('.data-stock').text()
  let   $dataPrice = $selData.find('.data-price').text()
        $dataPrice = $dataPrice.match(/\d+/)[0]
  const $dataArr   = [$dataID, $dataName, $dataCode, $dataType, $dataStock, $dataPrice]

  // INPUTS
  const $itemID    = $('.item-id')
  const $itemName  = $('.item-name-val')
  const $itemCode  = $('.item-code-val')
  const $itemType  = $('.item-type-val')
  const $itemStock = $('.item-stock-val')
  const $itemPrice = $('.item-price-val')
  const $inputArr  = [$itemID, $itemName, $itemCode, $itemType, $itemStock, $itemPrice]

  // PUT SELECTED DATA INTO INPUTS
  dataSift($dataArr, $inputArr)

  // SHOW MODAL
  showModal()

  // Lock/Unlock Icon elements
  const $descIcon   = $('.desc-icon')
  const $toggleEL = $('.lock-toggle')

  // Form & Submit elements
  const $form   = $('.update-inputs')
  const $update = $('.submit-update')

  // Local/Unlock Element Event Handler
  $descIcon.click(function() {
    const $self = $(this)


    if($self.hasClass('fa-lock')) {
      $self.removeClass('fa-lock').addClass('fa-unlock-alt')
    }
    else {
      $self.removeClass('fa-unlock-alt').addClass('fa-lock')
    }

    lockToggle($self)
  })

  // Lock Toggle Element Event Handler
  $toggleEL.click(function() {
    const $self     = $(this)
    const $selfIcon = $self.find('.ub-icon')
    const $selfText = $self.find('span')

    if($self.hasClass('unlock')) {
      $descIcon.removeClass('fa-lock').addClass('fa-unlock-alt') // Remove lock icon class & add unlock icon class
      $selfIcon.removeClass('fa-unlock-alt').addClass('fa-lock') // Remove unlock icon class & add lock icon class
      $self.removeClass('unlock').addClass('lock')               // Remove "unlock" class && add "lock" class
      $selfText.text('Lock All')                                 // Change text to "Lock All"
    }
    else if($self.hasClass('lock')){
      $descIcon.removeClass('fa-unlock-alt').addClass('fa-lock') // Remove unlock icon class
      $selfIcon.removeClass('fa-lock').addClass('fa-unlock-alt') // Remove lock icon class & add unlock icon class
      $self.removeClass('lock').addClass('unlock')               // Remove "lock" class & add "unlock" class
      $selfText.text('Unlock All')                               // Change text to "Unlock All"
    }

    lockToggle($descIcon)
  })

  closeModal(function() {
    const $lockIcon = $toggleEL.find('.ub-icon')
    const $lockText = $toggleEL.find('span')

    $descIcon.removeClass('fa-unlock-alt').addClass('fa-lock')
    $lockIcon.removeClass('fa-lock').addClass('fa-unlock-alt')
    $toggleEL.removeClass('lock').addClass('unlock')

    $lockText.text('Unlock All')
    $contentInputs.val('')
    lockInput($descIcon)

    $toggleEL.off("click")
    $descIcon.off("click")
  })

  formEv($form, $update, $itemName, $itemCode, $itemType, $itemStock, $itemPrice, function($form) {
    unlockInput($descIcon)
    $form.submit()
  })
}


// HELPER FUNCTIONS
function lockToggle(childEL) {
  const $parent   = childEL.parents('.input-container')
  const $inputs   = $parent.find('.input-val')
  const $disabled = $inputs.attr('disabled')

  if($disabled) {
    $inputs.removeAttr('disabled')
  }
  else {
    $inputs.prop('disabled', true)
  }
}

function lockInput(childEL) {
  const $parent   = childEL.parents('.input-container')
  const $inputs   = $parent.find('.input-val')
  const $disabled = $inputs.attr('disabled')

  if($disabled == undefined) {
    $inputs.prop('disabled', true)
  }
}

function unlockInput(childEL) {
  const $parent   = childEL.parents('.input-container')
  const $inputs   = $parent.find('.input-val')

  $inputs.each(function(_, el) {
    const $el = $(el)
    const $disabled = $el.attr('disabled')

    if($disabled) {
      $inputs.removeAttr('disabled')
    }
  })
}

function dataSift(dataArr, inputArr) {
  dataArr.forEach(function(data, index) {
    const input = inputArr[index]
    input.val(data)
  })
}
