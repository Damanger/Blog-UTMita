import { createClient } from '@sanity/client'

export default createClient({
    projectId: "8kdpxld9",
    dataset: "production",
    useCdn: true,
    apiVersion: '2021-03-25',
})