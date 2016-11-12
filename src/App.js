import React, { Component } from 'react';
import {initBoard, eachTile, moveUp, moveDown, moveLeft, moveRight} from './2048'
import './App.css';

const keyMove = {
    ArrowUp: moveUp,
    ArrowDown: moveDown,
    ArrowLeft: moveLeft,
    ArrowRight: moveRight
}

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {board: []}
    }

    componentWillMount() {
        this.setState({
            board: initBoard()
        })

        window.addEventListener('keydown', (e) => {
            if (e.key in keyMove) {
                this.setState({
                    board: keyMove[e.key](this.state.board)
                })
            }
        })
    }

    render() {
        return (
            <div className="App">
                <div className="Grid">
                {eachTile(this.state.board).map( ([x, y, value]) =>
                    <div className="Tile" key={`${x}-${y}`}>
                        <div className={"Tile-Inner " + (value ? 'Value-'+value : '')}>{value ? value : ''}</div>
                    </div>
                )}
                </div>
            </div>
        );
    }
}

export default App;
