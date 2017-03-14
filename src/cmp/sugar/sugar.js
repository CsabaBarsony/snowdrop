const Statechart = require('scion-core').Statechart
const Handlebars = require('handlebars')
const PubSub = require('pubsub-js')
const events = require('../../events.js')

let sc

function Sugar(container, onType) {
    this.container = container
    this.model = {
        loading: false,
        selectedIndex: -1,
        suggestions: []
    }

    this.container.innerHTML = `
        <div class="cmp-sugar">
            <input type="text" />
            <div class="content"></div>
        </div>`

    this.container.querySelector('input').addEventListener('focus', this.focus.bind(this))
    this.container.querySelector('input').addEventListener('blur', this.blur.bind(this))
    this.container.querySelector('input').addEventListener('input', this.input.bind(this))
    this.container.querySelector('input').addEventListener('keydown', this.keydown.bind(this))

    const actions = {
        blur: {
            entry: () => {
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
                onType(e.data, suggestions => {
                    sc.gen('load', suggestions)
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
                PubSub.publish(events.FOOD_SELECT, this.model.suggestions[this.model.selectedIndex].data)
                container.querySelector('input').value = ''
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
                },
                {
                    id: 'chosen',
                    onEntry: actions.chosen.entry,
                    transitions: [
                        {
                            event: 'type',
                            target: 'loading'
                        }
                    ]
                }
            ]
        }
    ]

    sc = new Statechart({ states: states }, { logStatesEnteredAndExited: false })
    sc.start()

    this.render()
}

Sugar.prototype.render = function() {
    const templateString = `
        {{#if loading}}
            <div>loading...</div>
        {{else}}
            <ul>
            {{#each suggestions}}
                <li{{{selected @index}}}>{{text}}</li>
            {{/each}}
            </ul>
        {{/if}}`

    Handlebars.registerHelper('selected', index => {
        return index === this.model.selectedIndex ? ' class="selected"' : ''
    })

    const template = Handlebars.compile(templateString)
    this.container.querySelector('.content').innerHTML = template(this.model)
}

Sugar.prototype.focus = function() {
    sc.gen('select')
}

Sugar.prototype.blur = function() {
    sc.gen('unselect')
}

Sugar.prototype.input = function(e) {
    if(e.target.value === '') sc.gen('clear')
    else sc.gen('type', e.target.value)
}

Sugar.prototype.keydown = function(e) {
    const firstSelected = cmp => {
        return cmp.model.selectedIndex === 0
    }

    const lastSelected = cmp => {
        return cmp.model.selectedIndex === cmp.model.suggestions.length - 1
    }

    if(e.key === 'ArrowUp') {
        firstSelected(this) ? sc.gen('bore', 'up') : sc.gen('excite', 'up')
    }
    else if(e.key === 'ArrowDown') {
        lastSelected(this) ? sc.gen('bore', 'down') : sc.gen('excite', 'down')
    }

    if(e.key === 'Enter') sc.gen('choose')
}

module.exports = Sugar
