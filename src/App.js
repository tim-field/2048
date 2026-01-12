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
        this.state = {board: initBoard()}
    }

    componentDidMount() {
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
                </div>
            </div>
        );
    }
}

export default App;
