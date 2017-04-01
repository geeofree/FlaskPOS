import $ from "jquery"
import buttonEv from "./button"
export { btnOpenModal, openModal, closeModal }


function btnOpenModal(btnTarget, content, modalEvent) {
  const modal = $('.modal')

  function showModal() {
    modal.addClass("active")
    content.addClass("active")
  }

  buttonEv(btnTarget, function() {
    modalEvent(content, showModal)
  })
}

function openModal(content, modalEvent) {
  const modal = $('.modal')

  function showModal() {
    modal.addClass("active")
    content.addClass("active")
  }

  modalEvent(content, showModal)
}

function closeModal(callback) {
  const closeHandler = $('.close')

  closeHandler.click(function() {
    const $self = $(this)

    if (callback) {
      callback()
    }

    $('.active').removeClass('active')
    $self.off("click")
  })
}
