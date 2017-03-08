import $ from "jquery"

function mouseEv(btn_targ, content) {
  const modal = $('.modal')

  function mdown() {
    btn_targ.addClass('clicked')
  }

  function mup(){
    btn_targ.removeClass('clicked')
    modal.addClass('active')
    content.addClass('active')
  }

  btn_targ.mousedown(mdown)
  btn_targ.mouseup(mup)
}

export default function modal() {
  const add_prod  = $('.product-add')
  const del_prod  = $('.product-delete')
  const edit_prod = $('.product-edit')

  const add_btn   = $('.add')
  const del_btn   = $('.delete')
  const edit_btn  = $('.edit')
  const close_btn = $('.close')

  mouseEv(add_btn, add_prod)
  mouseEv(del_btn, del_prod)
  mouseEv(edit_btn, edit_prod)

  close_btn.click(function() {
    $('.active').removeClass('active')
  })
}
