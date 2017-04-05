const app = require('../../app.js')
const Statechart = require('scion-core').Statechart
const Handlebars = require('handlebars')
const events = require('../../events.js')
const store = require('../../store.js')

function Sugar(container, publish) {
    this.container = container
    this.model = {
        loading: false,
        enabled: true,
        selectedIndex: -1,
        suggestions: []
    }

    this.container.innerHTML = `
        <div class="cmp sugar">
            <input type="text" placeholder="Start typing a food name..." autofocus />
            <div class="dropdown"></div>
        </div>`

    const input = this.container.querySelector('input')

    input.addEventListener('focus', () => {
        this.sc.gen('select')
    })

    input.addEventListener('blur', () => {
        this.sc.gen('unselect')
    })

    input.addEventListener('input', e => {
        if(e.target.value === '') this.sc.gen('clear')
        else this.sc.gen('type', e.target.value)
    })

    input.addEventListener('keydown', e => {
        const firstSelected = cmp => {
            return cmp.model.selectedIndex === 0
        }

        const lastSelected = cmp => {
            return cmp.model.selectedIndex === cmp.model.suggestions.length - 1
        }

        if(e.key === 'ArrowUp') {
            firstSelected(this) ? this.sc.gen('bore', 'up') : this.sc.gen('excite', 'up')
        }
        else if(e.key === 'ArrowDown') {
            lastSelected(this) ? this.sc.gen('bore', 'down') : this.sc.gen('excite', 'down')
        }

        if(e.key === 'Enter') this.sc.gen('choose')
    })

    const actions = {
        blur: {
            entry: () => {
                this.model.enabled = true
                this.model.selectedIndex = -1
                this.model.suggestions = []
                this.render()
            }
        },
        hidden: {
            entry: () => {
                this.model.selectedIndex = -1
                this.model.suggestions = []
                this.render()
            }
        },
        loading: {
            entry: e => {
                store.getSuggestions(e.data, suggestions => {
                    this.sc.gen('load', suggestions)
                })

                this.model.loading = true
                this.render()
            },
            exit: () => {
                this.model.loading = false
                this.render()
            }
        },
        suggesting: {
            entry: e => {
                this.model.suggestions = e.data
                this.render()
            }
        },
        typing: {
            entry: () => {
                this.model.selectedIndex = -1
                this.render()
            }
        },
        excited: {
            entry: e => {
                if(e.data === 'up'){
                    if(this.model.selectedIndex === -1){
                        this.model.selectedIndex = this.model.suggestions.length - 1
                    }
                    else{
                        this.model.selectedIndex--
                    }
                }
                else{
                    if(this.model.selectedIndex === this.model.suggestions.length - 1) this.model.selectedIndex = -1
                    this.model.selectedIndex++
                }

                this.render()
            }
        },
        chosen: {
            entry: () => {
                publish({ name: 'select', data: this.model.suggestions[this.model.selectedIndex].id })
                //PubSub.publish(events.SUGGESTION_SELECT, this.model.suggestions[this.model.selectedIndex].food)
                container.querySelector('input').value = ''
                this.model.enabled = false
                this.model.suggestions = []
                this.render()
            }
        }
    }

    const states = [
        {
            id: 'blur',
            onEntry: actions.blur.entry,
            transitions: [
                {
                    event: 'select',
                    target: 'focus'
                }
            ]
        },
        {
            id: 'chosen',
            onEntry: actions.chosen.entry,
            transitions: [
                {
                    event: 'reset',
                    target: 'blur'
                }
            ]
        },
        {
            id: 'focus',
            transitions: [
                {
                    event: 'unselect',
                    target: 'blur'
                }
            ],
            states: [
                {
                    id: 'hidden',
                    onEntry: actions.hidden.entry,
                    transitions: [
                        {
                            event: 'type',
                            target: 'loading'
                        }
                    ]
                },
                {
                    id: 'visible',
                    states: [
                        {
                            id: 'loading',
                            onEntry: actions.loading.entry,
                            onExit: actions.loading.exit,
                            transitions: [
                                {
                                    event: 'load',
                                    target: 'typing'
                                },
                                {
                                    event: 'clear',
                                    target: 'hidden'
                                },
                                {
                                    event: 'type',
                                    target: 'loading'
                                }
                            ]
                        },
                        {
                            id: 'suggesting',
                            onEntry: actions.suggesting.entry,
                            transitions: [
                                {
                                    event: 'type',
                                    target: 'loading'
                                },
                                {
                                    event: 'clear',
                                    target: 'hidden'
                                },
                                {
                                    event: 'choose',
                                    target: 'chosen'
                                }
                            ],
                            states: [
                                {
                                    id: 'typing',
                                    onEntry: actions.typing.entry,
                                    transitions: [
                                        {
                                            event: 'excite',
                                            target: 'excited'
                                        }
                                    ]
                                },
                                {
                                    id: 'excited',
                                    onEntry: actions.excited.entry,
                                    transitions: [
                                        {
                                            event: 'excite',
                                            target: 'excited'
                                        },
                                        {
                                            event: 'bore',
                                            target: 'typing'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]

    this.sc = new Statechart({ states: states }, { logStatesEnteredAndExited: false })
    this.sc.start()

    this.render()
}

Sugar.prototype.render = function() {
    const templateString = `
        {{#if loading}}
            <div>loading...</div>
        {{else if suggestions.length}}
            <ul>
            {{#each suggestions}}
                <li{{{selected @index}}}>{{name}}</li>
            {{/each}}
            </ul>
        {{/if}}`

    this.container.querySelector('input').disabled = !this.model.enabled

    Handlebars.registerHelper('selected', index => {
        return index === this.model.selectedIndex ? ' class="selected"' : ''
    })

    const template = Handlebars.compile(templateString)
    this.container.querySelector('.dropdown').innerHTML = template(this.model)
}

Sugar.prototype.setAccess = function(enabled) {
    this.model.enabled = enabled
    this.render()
    this.sc.gen('reset')
    this.container.querySelector('input').focus()
}

module.exports = Sugar
