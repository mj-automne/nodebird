const express = require('express'); 
const postRouter = require('./routes/post');

const app = express()

app.get('/', (req, res) => {
  res.send('hello express')
})

app.get('/', (req, res) => {
  res.send('hello api')
})

app.get('/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'node' },
    { id: 3, content: 'js' }
  ])
})

app.use('/post', postRouter)

app.listen(3030, () => {
  console.log('3030 서버 실행중...')
});