// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from 'deps/phoenix/web/static/js/phoenix'

let socket = new Socket('/socket', {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

let btn = document.getElementById('btn-enable-geolocation')

btn.addEventListener('click', event => {
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

function addMarker(issue) {
  map.addMarker({
    lat: issue.latitude,
    lng: issue.longitude,
    infoWindow: {
      content: `<p>${issue.message}</p>`
    },
    icon: '/images/lamp.png'
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

socket.connect()

let channel = socket.channel('issues:home', {})
channel.join()
  .receive('ok', resp => { console.log('Joined successfully', resp) })
  .receive('error', resp => { console.log('Unable to join', resp) })

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

export default socket
