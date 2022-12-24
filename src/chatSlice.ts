import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {api} from './api';

export type Message = {
    id: string
    message: string
    user: User
}

export type User = {
    id: string
    name: string
}

export const startConnection = createAsyncThunk('chat/startConnection', (arg, {
        dispatch
    }) => {
        api.createConnection()
        api.subscribe((messages) => {
            dispatch(fetchMessages({messages}))
        }, (message) => {
            dispatch(getMessage({message}))
        }, (user) => {
            dispatch(addTypingUser({user}))
        })
    }
)

export const stopConnection = createAsyncThunk('chat/stopConnection', (arg, {
        dispatch
    }) => {
        api.destroyConnection()
        dispatch(clearMessages())
    }
)

export const setClientName = createAsyncThunk('chat/setClientName', (name: string) => {
    api.sendName(name)
})
export const sendNewMessage = createAsyncThunk('chat/setClientName', (message: string) => {
    api.sendMessage(message)
})
export const typeMessage = createAsyncThunk('chat/setClientName', () => {
    api.messageTyping()
})


export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [] as Message[],
        typingUsers: [] as User[]
    },
    reducers: {
        fetchMessages: (state, action: PayloadAction<{ messages: Message[] }>) => {
            state.messages = action.payload.messages
        },
        getMessage: (state, action: PayloadAction<{ message: Message }>) => {
            state.messages.push(action.payload.message)
            const userIndex = state.typingUsers.findIndex(u => u.id === action.payload.message.user.id)
            userIndex > -1 && state.typingUsers.splice(userIndex, 1)
        },
        clearMessages: (state) => {
            state.messages = []
        },
        addTypingUser: (state, action: PayloadAction<{ user: User }>) => {
            const userIndex = state.typingUsers.findIndex(u => u.id === action.payload.user.id)
            if (userIndex === -1) {
                state.typingUsers.push(action.payload.user)
            }
        }
    },
})

export const {fetchMessages, getMessage, clearMessages, addTypingUser} = chatSlice.actions

export const chatReducer = chatSlice.reducer



