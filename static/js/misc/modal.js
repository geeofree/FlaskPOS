import $ from "jquery"

export default function openModal(btn_targ, content, modalEvent) {
  const modal    = $('.modal')

  function mdown() {
    btn_targ.addClass('clicked')
  }

  function mup(){
    btn_targ.removeClass('clicked')
    modalEvent(modal, content)
  }

  btn_targ.mousedown(mdown)
  btn_targ.mouseup(mup)
}
