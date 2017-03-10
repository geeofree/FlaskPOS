import $ from "jquery"
import openModal from "../misc/modal"
import { formEv } from "./addItem"

const closeBtn = $('.close')

export default function updateItem() {
  const $editBtn     = $('.edit')
  const $editModal   = $('.update-modal')

  openModal($editBtn, $editModal, modalEvent)
}


// MODAL EVENT
function modalEvent(modal, content) {
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
  modal.addClass('active')
  content.addClass('active')

  // Lock/Unlock Icon elements
  const $descIcon   = $('.desc-icon')
  const $lockToggle = $('.lock-toggle')

  // Form & Submit elements
  const $form   = $('.update-inputs')
  const $update = $('.submit-update')

  $descIcon.click(function() {
    const $self = $(this)

    if($self.hasClass('fa-lock')) {
      $self.removeClass('fa-lock').addClass('fa-unlock-alt')
    }
    else if($self.hasClass('fa-unlock-alt')) {
      $self.removeClass('fa-unlock-alt').addClass('fa-lock')
    }

    toggleLock($self)
  })

  $lockToggle.click(function() {
    const $self     = $(this)
    const $selfIcon = $self.find('.ub-icon')
    const $selfText = $self.find('span')

    if($self.hasClass('unlock')) {
      $descIcon.removeClass('fa-lock').addClass('fa-unlock-alt')
      $selfIcon.removeClass('fa-unlock-alt').addClass('fa-lock')
      $self.removeClass('unlock').addClass('lock')
      $selfText.text('Lock All')
    }
    else if($self.hasClass('lock')){
      $descIcon.removeClass('fa-unlock-alt').addClass('fa-lock')
      $selfIcon.removeClass('fa-lock').addClass('fa-unlock-alt')
      $self.removeClass('lock').addClass('unlock')
      $selfText.text('Unlock All')
    }

    toggleLock($descIcon)
  })

  closeBtn.click(function() {
    $('.active').removeClass('active')
    $lockToggle.off("click")
    $descIcon.removeClass('fa-unlock-alt').addClass('fa-lock')
    $lockToggle.removeClass('lock').addClass('unlock')
    $lockToggle.find('.ub-icon').removeClass('fa-lock').addClass('fa-unlock-alt')
    $lockToggle.find('span').text('Unlock All')
    $contentInputs.val('')
    lockInput($descIcon)
  })

  formEv($form, $update, $itemName, $itemCode, $itemType, $itemStock, $itemPrice)
}


// HELPER FUNCTIONS
function toggleLock(childEL) {
  const $parent   = childEL.parents('.input-container')
  const $inputs   = $parent.find('.input')
  const $disabled = $inputs.attr('disabled')

  if(typeof $disabled !== typeof undefined && $disabled !== false) {
    $inputs.removeAttr('disabled')
  }
  else {
    $inputs.prop('disabled', true)
  }
}

function lockInput(childEL) {
  const $parent = childEL.parents('.input-container')
  const $inputs = $parent.find('.input')
  const $disabled = $inputs.attr('disabled')

  if(typeof $disabled == typeof undefined || !$disabled) {
    $inputs.prop('disabled', true)
  }
}

function dataSift(dataArr, inputArr) {
  dataArr.forEach(function(data, index) {
    const input = inputArr[index]
    input.val(data)
    console.log(input.val())
  })
}
