import mongoose from 'mongoose'

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/test'

export async function connection(uri = process.env.MONGO_URI || DEFAULT_URI) {
  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:')
    throw err
  }
}

export async function closeConnection() {
  try {
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
  } catch (err) {
    console.error('Error closing MongoDB connection', err)
  }
}
