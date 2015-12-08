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
// import L from 'leaflet'
// TODO: find a way to load with npm and remove scripts from html template

let channel = socket.channel('issues:home', {})
channel.join()
  .receive('ok', resp => { console.log('Joined successfully', resp) })
  .receive('error', resp => { console.log('Unable to join', resp) })

let opts = {
  contextmenu: true,
  contextmenuWidth: 140,
  contextmenuItems: [
    {
      text: 'Make report',
      callback: e => {
        form.find('textarea[name="message"]').val('')
        form.find('input[name="latitude"]').val(e.latlng.lat)
        form.find('input[name="longitude"]').val(e.latlng.lng)
        modal.modal('show')
      }
    }
  ]
}

let map = L.map('map', opts).setView([-12.043333, -77.028333], 12)
let markers = []

map.on('locationfound', e => {
  let radius = e.accuracy / 2
  L.circle(e.latlng, radius).addTo(map)
})

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

$('#btn-enable-geolocation').on('click', function(event) {
  event.preventDefault()
  map.locate({setView: true, zoom: 16})
})

$('#btn-load-all-issues').on('click', function(event) {
  event.preventDefault()
  loadIssues()
})

$('#btn-load-fixed').on('click', function(event) {
  event.preventDefault()
  loadIssues({fixed: true})
})

$('#btn-load-unfixed').on('click', function(event) {
  event.preventDefault()
  loadIssues({fixed: false})
})

let form = $('#issue-form')
let modal = $('#issue-modal')

const ICONS = {
  'broken semaphore': '/images/semaphore.png',
  'broken lamp post': '/images/lamp.png'
}

window.fixIssue = function (id) {
  $.ajax({
    method: 'put',
    url: `/api/issues/${id}/`,
    data: {
      issue: {
        fixed: true
      }
    },
    success: function () {}
  })
}

function addMarker(issue) {
  var marker = L.marker([issue.latitude, issue.longitude], {
    icon: L.icon({
      iconUrl: ICONS[issue.type]
    })
  })
  marker.addTo(map)
  markers.push(marker)
  marker.on('click', e => {
    L.popup()
      .setLatLng(e.latlng)
      .setContent(`
        <p>${issue.message} ${issue.fixed ? '(fixed)' : ''}</p>
        <button class="btn btn-primary" onClick="fixIssue(${issue.id})">
          Fix
        </button>
      `)
      .openOn(map)
  })
}

function removeMarkers() {
  markers.forEach(marker => {
    map.removeLayer(marker)
  })
  markers = []
}

function loadIssues(params) {
  removeMarkers()
  params = params || {}
  $.ajax({
    method: 'get',
    url: `/api/issues/?${$.param(params)}`,
    success: function (issues) {
      issues.data.map(issue => {
        addMarker(issue)
      })
    }
  })
}

loadIssues()

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
