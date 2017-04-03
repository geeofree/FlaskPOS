import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"


export default function reports() {
  const monthly   = {opener: 'monthly-report', modal: 'monthly-modal'}
  const weekly    = {opener: 'weekly-report', modal: 'weekly-modal'}
  const daily     = {opener: 'daily-report', modal: 'daily-modal'}
  const low_stock = {opener: 'low-stock-report', modal: 'low-stock-modal'}
  const no_stock  = {opener: 'no-stock-report', modal: 'no-stock-modal'}

  reportModals([monthly, weekly, daily, low_stock, no_stock])
}


function reportModals(sales) {
  sales.forEach(sale => {
    const $modalOpener = $('.' + sale.opener)
    const $modal = $('.' + sale.modal)
    btnOpenModal($modalOpener, $modal, modalEvent)
  })

  function modalEvent(content, showModal) {
    // SHOW MODAL
    showModal()

    // CLOSE MODAL
    closeModal()
  }
}
