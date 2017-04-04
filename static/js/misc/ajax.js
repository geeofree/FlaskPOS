import $ from "jquery"

export default function ajax(data, url, response) {
  $.ajax({
     type: 'POST',
     url: url,
     data: JSON.stringify(data),
     contentType: 'application/json',
     success: response
  });
}
