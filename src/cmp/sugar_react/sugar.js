const Statechart = require('scion-core').Statechart
const store = require('../../store.js')
const React = require('react')
const placeholder = 'Start typing a food name...'

class Sugar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            text: '',
            loading: false,
            enabled: true,
            selectedIndex: -1,
            suggestions: []
        }

        const actions = {
            blur: {
                entry: () => this.setState({
                    enabled: true,
                    selectedIndex: -1,
                    suggestions: []
                })
            },
            hidden: {
                entry: () => this.setState({
                    text: '',
                    selectedIndex: -1,
                    suggestions: []
                })
            },
            loading: {
                entry: e => {
                    store.getSuggestions(e.data, suggestions => {
                        this.sc.gen('load', suggestions)
                    })

                    this.setState({
                        text: e.data,
                        loading: true
                    })
                },
                exit: () => this.setState({ loading: false })
            },
            suggesting: {
                entry: e => this.setState({ suggestions: e.data })
            },
            typing: {
                entry: () => this.setState({ selectedIndex: -1 })
            },
            excited: {
                entry: e => {
                    if(e.data === 'up') {
                        if(this.state.selectedIndex === -1)
                            this.setState({ selectedIndex: this.state.suggestions.length - 1 })
                        else
                            this.setState({ selectedIndex: this.state.selectedIndex - 1})
                    }
                    else {
                        if(this.state.selectedIndex === this.state.suggestions.length - 1)
                            this.setState({ selectedIndex: -1 })
                        else
                            this.setState({ selectedIndex: this.state.selectedIndex + 1})
                    }
                }
            },
            chosen: {
                entry: () => {
                    this.props.foodSelect()
                    this.setState({
                        text: '',
                        enabled: false,
                        suggestions: []
                    })

                    store.getFood(this.state.suggestions[this.state.selectedIndex].id, food => {
                        this.props.foodLoad(food)
                        this.sc.gen('reset')
                    })
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

        this.sc = new Statechart({ states: states }, { logStatesEnteredAndExited: true })
    }

    componentDidMount() {
        this.sc.start()
    }

    render() {
        const suggestionItems = this.state.suggestions.map((suggestion, index) =>
            <li key={index} className={index === this.state.selectedIndex ? 'selected' : ''}>
                {suggestion.name}
            </li>)

        const suggestionList = this.state.suggestions.length === 0 ? '' : <ul>{suggestionItems}</ul>

        const content = this.state.loading ? <div>loading...</div> : suggestionList

        return (
            <div className="cmp sugar">
                <input
                    type="text"
                    value={this.state.text}
                    placeholder={placeholder}
                    disabled={!this.state.enabled}
                    onFocus={this.onFocus.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    onChange={this.onChange.bind(this)}
                    onKeyDown={this.onKeyDown.bind(this)} />
                <div className="dropdown">{content}</div>
            </div>)
    }

    onChange(e) {
        if(e.target.value === '') this.sc.gen('clear')
        else this.sc.gen('type', e.target.value)
    }

    onKeyDown(e) {
        if(e.key === 'Enter') {
            this.sc.gen('choose')
        }
        else {
            const firstSelected = () => this.state.selectedIndex === 0
            const lastSelected = () => this.state.selectedIndex === this.state.suggestions.length - 1

            if(e.key === 'ArrowUp')
                firstSelected(this) ? this.sc.gen('bore', 'up') : this.sc.gen('excite', 'up')
            else if(e.key === 'ArrowDown')
                lastSelected(this) ? this.sc.gen('bore', 'down') : this.sc.gen('excite', 'down')
        }
    }

    onFocus() {
        this.sc.gen('select')
    }

    onBlur() {
        this.sc.gen('unselect')
    }
}

module.exports = Sugar
