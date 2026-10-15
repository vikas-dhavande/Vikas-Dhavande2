import { Client } from 'appwrite'

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'default'

const client = new Client()
if (endpoint) {
  client.setEndpoint(endpoint)
}
if (projectId) {
  client.setProject(projectId)
}

export { client }
