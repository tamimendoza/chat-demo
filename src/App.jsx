import { useState, useEffect } from 'react'
import { Client } from '@stomp/stompjs'

function App () {
  const [stompCliente, setStompCliente] = useState(null)
  const [mensajes, setMensajes] = useState([])
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    setNombre('Desconocido')
    setMensaje('')
    const cliente = new Client({
      brokerURL: 'ws://localhost:8080/websocket'
    })
    cliente.onConnect = () => {
      cliente.subscribe('/tema/mensajes', (mensaje) => {
        const nuevoMsg = JSON.parse(mensaje.body)
        setMensajes((p) => [...p, nuevoMsg])
      })
    }
    cliente.activate()
    setStompCliente(cliente)

    return () => {
      if (cliente) {
        cliente.deactivate()
      }
    }
  }, [])

  const evtEnviarMensaje = () => {
    if (stompCliente !== null && nombre !== '' && mensaje !== '') {
      stompCliente.publish({
        destination: '/app/envio',
        body: JSON.stringify({
          nombre,
          contenido: mensaje
        })
      })
      setMensaje('')
    }
  }

  return (
    <main className='container'>
      <article className='row'>
        <article className='col-12'>
          {mensajes.map((msg, i) => (
            <p key={i}><b>{msg.nombre}</b>: {msg.contenido}</p>
          ))}
        </article>
      </article>
      <article className='row'>
        <section className='col'>
          <section className='form-floating'>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} id='txtNombre' type='text' className='form-control' />
            <label htmlFor='txtNombre'>Nombre</label>
          </section>
        </section>
        <section className='col-6'>
          <section className='form-floating'>
            <input value={mensaje} onChange={(e) => setMensaje(e.target.value)} id='txtMensaje' type='text' className='form-control' />
            <label htmlFor='txtMensaje'>Mensaje</label>
          </section>
        </section>
        <section className='col d-grid'>
          <button onClick={evtEnviarMensaje} className='btn btn-primary'>Enviar</button>
        </section>
      </article>
    </main>
  )
}

export default App
