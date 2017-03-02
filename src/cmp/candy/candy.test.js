/* global describe, xdescribe, it, xit, expect, beforeEach, spyOn */

const Candy = require('./candy.js')
const PubSub = require('pubsub-js')

describe('Candy', function() {
    const container = document.createElement('div')
    new Candy(container, {})

    it('should display button and message field', function() {
        const button = container.querySelector('button')
        const message = container.querySelector('.message')

        expect(button).not.toBeNull()
        expect(button.textContent).toBe('Click me!')

        expect(message).not.toBeNull()
        expect(message.textContent).toBe('init')
    })
})

describe('Candy async', function() {
    let loading

    const store = {
        getMessage: getMessage
    }

    const pubSubEvent = {
        messageReadyCallback: messageReadyCallback
    }

    function getMessage(callback) {}

    function messageReadyCallback() {}

    const container = document.createElement('div')
    new Candy(container, store)

    PubSub.subscribe('message ready', messageReadyCallback)

    beforeEach(function() {
        spyOn(store, 'getMessage')
        spyOn(pubSubEvent, 'messageReadyCallback')
        container.querySelector('button').dispatchEvent(new Event('click'))
    })

    it('should call store\'s getMessage', function() {
        expect(container.querySelector('.loading')).not.toBeNull()
        expect(store.getMessage).toHaveBeenCalled()
    })
})

describe('Candy message loaded callback', function() {
    let store, container, pubSubEvent

    beforeEach(function(done) {
        store = {
            getMessage: getMessage
        }

        function getMessage(callback) {
            callback('you are a monkey')
            done()
        }

        pubSubEvent = {
            messageReadyCallback: messageReadyCallback
        }

        function messageReadyCallback() {
            done()
        }

        PubSub.subscribe('message ready', messageReadyCallback)

        spyOn(pubSubEvent, 'messageReadyCallback')

        container = document.createElement('div')
        new Candy(container, store)
        container.querySelector('button').dispatchEvent(new Event('click'))
    })

    it('should be invoked', function(done) {
        expect(container.querySelector('.message').textContent).toContain('you are a monkey')
        done()
    })
})

describe('Candy message loaded callback', function() {
    let store, container, pubSubEvent
    let called = false

    beforeEach(function(done) {
        store = {
            getMessage: getMessage
        }

        function getMessage(callback) {}

        pubSubEvent = {
            messageReadyCallback: messageReadyCallback
        }

        function messageReadyCallback() {
            called = true
            done()
        }

        PubSub.subscribe('message ready', messageReadyCallback)

        container = document.createElement('div')
        new Candy(container, store)
        container.querySelector('button').dispatchEvent(new Event('click'))
    })

    it('should be invoked', function(done) {
        expect(called).toBeTruthy()
        done()
    })
})
