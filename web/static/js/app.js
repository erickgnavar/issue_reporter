// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "deps/phoenix_html/web/static/js/phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

let channel = socket.channel('issues:home', {})
channel.join()
  .receive('ok', resp => { console.log('Joined successfully', resp) })
  .receive('error', resp => { console.log('Unable to join', resp) })

$('#btn-enable-geolocation').on('click', function(event) {
  event.preventDefault()
  GMaps.geolocate({
    success: function(position) {
      map.setCenter(position.coords.latitude, position.coords.longitude);
      map.addMarker({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    },
    error: function(error) {},
    not_supported: function() {},
    always: function() {}
  })
})

let map = new GMaps({
  div: '#map',
  lat: -12.043333,
  lng: -77.028333,
  zoom: 12
})

let form = $('#issue-form')
let modal = $('#issue-modal')

map.setContextMenu({
  control: 'map',
  options: [
    {
      title: 'Add marker',
      action: function (e) {
        form.find('textarea[name="message"]').val('')
        form.find('input[name="latitude"]').val(e.latLng.lat())
        form.find('input[name="longitude"]').val(e.latLng.lng())
        modal.modal('show')
      }
    }
  ]
})

const ICONS = {
  'broken semaphore': '/images/semaphore.png',
  'broken lamp post': '/images/lamp.png'
}

function addMarker(issue) {
  map.addMarker({
    lat: issue.latitude,
    lng: issue.longitude,
    infoWindow: {
      content: `<p>${issue.message}</p>`
    },
    icon: ICONS[issue.type]
  })
}

$.ajax({
  method: 'get',
  url: '/api/issues/',
  success: function (issues) {
    issues.data.map(issue => {
      addMarker(issue)
    })
  }
})

channel.on('new_issue', payload => {
  addMarker(payload.issue)
})

$('#btn-add-issue').on('click', function () {
  let issue = {
    latitude: parseFloat(form.find('input[name="latitude"]').val()),
    longitude: parseFloat(form.find('input[name="longitude"]').val()),
    type: form.find('select[name="type"]').val(),
    message: form.find('textarea[name="message"]').val(),
    fixed: false
  }
  channel.push('new_issue', {issue: issue})
  modal.modal('toggle')
})
