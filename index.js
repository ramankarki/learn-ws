import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { memoryUsage } from 'process'

function onSocketError(err) {
  console.error(err)
}

const server = createServer()
const wss = new WebSocketServer({ noServer: true, path: '/check' })

wss.on('connection', function connection(ws, request, client) {
  ws.on('error', console.error)

  ws.on('message', function message(data) {})

  setInterval(() => {
    ws.send('echo', (err) =>
      console.log(err?.message, 'sent', wss.clients.size)
    )
  }, 1000)

  // ws.on('close', () => {
  //   const lastToDisconnect = wss.clients.size === 0
  //   if (lastToDisconnect) {
  //     gc()
  //   }
  // })
})

server.on('upgrade', function upgrade(request, socket, head) {
  socket.on('error', onSocketError)

  // This function is not defined on purpose. Implement it with your own logic.
  authenticate(request, function next(err, client) {
    if (err || !client) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
      return
    }

    socket.removeListener('error', onSocketError)

    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request, client)
    })
  })
})

server.listen(8888, () => console.log('server running on 8888'))

function authenticate(req, fn) {
  // console.log('authenticated')
  fn(null, 'user 1')
}

// const printStats = () => {
//   const { rss, heapUsed, heapTotal } = memoryUsage()

//   const values = [
//     wss.clients.size,
//     heapUsed / (1024 * 1024), // in kb
//     heapTotal / (1024 * 1024), // in kb
//   ]

//   console.log(values)
// }

// setInterval(() => {
//   printStats()
// }, 1000)
