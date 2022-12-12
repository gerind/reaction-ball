import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ITop } from './data.slice'

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${window.location.origin}`
  }),
  endpoints: (build) => ({
    getTop: build.query<ITop, void>({
      query: () => 'top'
    })
  })
})

export const { useGetTopQuery } = dataApi

