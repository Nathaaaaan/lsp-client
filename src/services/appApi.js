import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

// define a service user a base URL

const appApi = createApi({
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5001'
    }),

    endpoints: (builder) => ({
        // creating the user
        signupUser: builder.mutation({
            query: (user) => ({
                url: '/users',
                method: 'POST',
                body: user,
            }),
        }),
        // login
        loginUser: builder.mutation({
            query: (user) => ({
                url: '/users/login',
                method: 'POST',
                body: user,
            }),
        }),
        // logout
        logoutUser : builder.mutation({
            query: (payload) => ({
                url: '/logout',
                method: 'DELETE',
                body: payload,
            }),
        }),
        updateUser: builder.mutation({
            query: (user) => ({
                url: '/users/edit',
                method: 'PATCH',
                body: user,
            }),
        }),
        checkBanStatus: builder.mutation({
            query: (user) => ({
                url: '/users/checkbanstatus',
                method: 'PATCH',
                body: user,
            }),
        }),
        banUser: builder.mutation({
            query: ({user_id, admin_id}) => ({
                url: `/users/ban/${user_id}`,
                method: 'PATCH',
                body: { admin_id },
            }),
        }),
        unbanUser: builder.mutation({
            query: ({user_id, admin_id}) => ({
                url: `/users/unban/${user_id}`,
                method: 'PATCH',
                body: { admin_id },
            }),
        }),
        deleteUser: builder.mutation({
            query: ({ user_id, admin_id }) => ({
                url: `/users/${user_id}`,
                body: {
                    admin_id
                },
                method: "DELETE",
            }),
        }),
    }),
})

export const {useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useUpdateUserMutation, useCheckBanStatusMutation, useBanUserMutation, useUnbanUserMutation, useDeleteUserMutation} = appApi

export default appApi;