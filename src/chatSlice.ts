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

export const setClientName = createAsyncThunk('chat/setClientName', async (name: string) => {
    api.sendName(name)
})
export const sendNewMessage = createAsyncThunk('chat/setClientName', async (message: string) => {
    api.sendMessage(message)
})


export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [] as Message[]
    },
    reducers: {
        fetchMessages: (state, action: PayloadAction<{ messages: Message[] }>) => {
            state.messages = action.payload.messages
        },
        getMessage: (state, action: PayloadAction<{ message: Message }>) => {
            state.messages.push(action.payload.message)
        },
        clearMessages: (state) => {
            state.messages = []
        }
    },
})

export const {fetchMessages, getMessage, clearMessages} = chatSlice.actions

export const chatReducer = chatSlice.reducer



