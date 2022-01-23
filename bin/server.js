import app from '../app'
import db from '../lib/db'
import { mkdir } from 'fs/promises'

const PORT = process.env.PORT || 3000

db.then(() => {
  app.listen(PORT, async () => {
    await mkdir(process.env.UPLOAD_DIR, {recursive: true})
    console.log(`Server running. Use our API on port: ${PORT}`)
  })
}).catch(error => {
  console.log(`Server not running. Error: ${error.message}`);
})

