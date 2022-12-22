import React, {ChangeEvent, useEffect, useState, KeyboardEvent} from 'react';
import './App.css';
import {io} from 'socket.io-client';

type Message = {
    id: string
    message: string
    user: {
        id: string,
        name: string
    }
}

// const socket = io('https://chat-socket-io-back-production.up.railway.app/');
const socket = io('http://localhost:5000/');

function App() {


    const [text, setText] = useState('')
    const [messages, setMessages] = useState<Message[]>([])

    const onchangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.currentTarget.value)
    }

    const onClickHandler = () => {
        socket.emit('client-message-sent', text)
        setText('')
    }

    const onEnterDownHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        e.key === 'Enter' && onClickHandler()
    }

    useEffect(() => {
        socket.on('init-messages-published', (messages: Message[]) => {
            setMessages(messages)
        })
        socket.on('new-message-sent', (newMessage: Message) => {
            setMessages((prevMessages) => [...prevMessages, newMessage])
        })
    }, [])

    return (
        <div className="App">
            <div className="wrapper">
                <div className="messages">
                    {messages.map(m => <div key={m.id}>
                        <b>{m.user.name}: </b> {m.message}
                        <hr/>
                    </div>)}
                </div>
                <div className="textarea">
                    <textarea value={text} onChange={onchangeHandler} onKeyDown={onEnterDownHandler}/>
                    <button onClick={onClickHandler}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default App;
