import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"
import ajax from "../misc/ajax"

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
    showModal()
    const $reportOpener = content.find('.generate-report-btn')

    $reportOpener.off("click")
    $reportOpener.click(function() {
      const $self   = $(this)
      const monthly = $self.hasClass('monthly-report')
      const weekly  = $self.hasClass('weekly-report')
      const daily   = $self.hasClass('daily-report')


      if(monthly) {
        getReport('monthly')
      }
      else if(weekly) {
        getReport('weekly')
      }
      else if(daily) {
        getReport('daily')
      }
    })

    closeModal()
  }
}

function getReport(timeframe) {

  function response(resp) {
    window.open(resp.url, '_blank')
  }

  ajax({ timeframe }, '/sales_report/', response)
}
