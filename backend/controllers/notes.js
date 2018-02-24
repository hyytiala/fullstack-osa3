const notesRouter = require('express').Router()
const Note = require('../models/note')


notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.json(notes.map(Note.format))
})

notesRouter.get('/:id', async (request, response) => {
    try {
      const note = await Note.findById(request.params.id)
  
      if (note) {
        response.json(Note.format(note))
      } else {
        response.status(404).end()
      }
  
    } catch (exception) {
      console.log(exception)
      response.status(400).send({ error: 'malformatted id' })
    }
  })

  notesRouter.delete('/:id', async (request, response) => {
    try {
      await Note.findByIdAndRemove(request.params.id)
  
      response.status(204).end()
    } catch (exception) {
      console.log(exception)
      response.status(400).send({ error: 'malformatted id' })
    }
  })

notesRouter.post('/', async (request, response) => {
    try {
      const body = request.body
  
      if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
      }
  
      const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        date: new Date()
      })
  
      const savedNote = await note.save()
      response.json(Note.format(note))
    } catch (exception) {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  })

notesRouter.put('/:id', (request, response) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note
        .findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(Note.format(updatedNote))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

module.exports = notesRouter