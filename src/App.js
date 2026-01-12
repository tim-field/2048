import React, { Component } from 'react';
import {initBoard, getRowIndexes, getColumnIndexes, getValue, moveUp, moveDown, moveLeft, moveRight} from './2048'
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
        this.state = {board: [], gameOver: false}
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    handleKeyDown(e) {
        if (this.state.gameOver) {
            return
        }
        if (e.key in keyMove) {
            const newBoard = keyMove[e.key](this.state.board)
            if (newBoard === null) {
                this.setState({
                    gameOver: true
                })
            } else {
                this.setState({
                    board: newBoard
                })
            }
        }
    }

    componentDidMount() {
        this.setState({
            board: initBoard()
        })

        window.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown)
    }

    render() {
        return (
            <div className="App">
                <div className="Grid">
                    <table className="board">
                        <tbody>
                        {getRowIndexes().map( x => 
                            <tr key={x}>
                                {getColumnIndexes().map( y => { 
                                    
                                    const value = getValue(x,y,this.state.board)
                                    
                                    return ( 
                                        <td className={"tile"+" tile-"+value} key={y}>
                                            {value}
                                        </td>
                                    )
                                })}
                            </tr>
                        )}
                        </tbody>
                    </table>
                    {this.state.gameOver && (
                        <div className="game-over-overlay">
                            <div className="game-over-text">Game Over</div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default App;
