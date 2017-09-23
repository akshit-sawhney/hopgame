import { Component } from 'preact';
import { route } from 'preact-router';
import Fab from 'preact-material-components/Fab';
import firebaseLoader from '../../scripts/firebase-loader.js';
import LinearProgress from 'preact-material-components/LinearProgress';
import 'preact-material-components/LinearProgress/style.css';
import 'preact-material-components/Fab/style.css';
import style from './stage.css';
export default class Stage extends Component {
  static GameState = {
    NOTLOADED: 0,
    READY: 1,
    PLAYING: 2,
    FINISHED: 3
  };
  constructor() {
    super();
    this.state = {
      score: '',
      gameState: Stage.GameState.NOTLOADED,
      highScore: localStorage.highscore,
      overAllHighScore: localStorage.overAllHighScore
    };
  }
  componentDidMount() {
    if (!localStorage.uname) {
      route('/');
    } else {
      this.initGame();
    }
    try {
      console.log(firebase);
    } catch (error) {
      firebaseLoader.then(initFirebase => {
        initFirebase();
      });
    }
  }
  initGame() {
    require.ensure(
      '../../game/GameScene',
      require => {
        this.setState(
          {
            gameState: Stage.GameState.READY
          },
          () => {
            const GameScene = require('../../game/GameScene').default;
            this.scene = new GameScene(this.canvas, {
              onScore: () => {
                this.setState(
                  {
                    score: this.state.score + 1
                  },
                  () => {
                    if (this.state.score % 20 === 0) {
                      this.scene.increaseGameSpeed();
                    }
                  }
                );
              },
              onInit: () => {
                this.setState({
                  score: 0,
                  gameState: Stage.GameState.PLAYING
                });
              },
              onFinish: () => {
                const highScore = localStorage.highscore || 0;
                const overAllHighScore = localStorage.overAllHighScore || 0;
                if (parseInt(this.state.score) > parseInt(highScore)) {
                  localStorage.highscore = parseInt(this.state.score);
                  let userId = localStorage.uid;
                  if(firebase) {
                    if(userId) {
                      firebase.database().ref('/userArray/' + userId).set(parseInt(this.state.score));
                    }
                  }
                }
                if (parseInt(this.state.score) > parseInt(overAllHighScore)) {
                  console.log(this.state.score);
                  console.log(overAllHighScore);
                  localStorage.overAllHighScore = parseInt(this.state.score);
                  this.state.overAllHighScore = this.state.score;
                  let userId = localStorage.uid;
                  if(firebase) {
                    if(userId) {
                      firebase.database().ref('/topScore').set(this.state.score);
                    }
                  }
                }
                this.setState({
                  gameState: Stage.GameState.FINISHED,
                  highScore: localStorage.highscore || this.state.score,
                  overAllHighScore: localStorage.overAllHighScore || this.state.score
                });
              }
            });
          }
        );
      },
      'gameengine'
    );
  }
  render() {
    return (
      <div className={style.page}>
        <div className={style.scoreContainer}>
          <div className="mdc-typography--display2">{this.state.score}</div>
          {this.state.gameState == Stage.GameState.FINISHED &&
            <div className="mdc-typography--body">
              High score - {this.state.highScore}
            </div>
            }
            {this.state.gameState == Stage.GameState.FINISHED &&
            <div className="mdc-typography--body">
              Overall high score - {this.state.overAllHighScore}
            </div>
            }
        </div>
        {!this.state.isLoaded &&
          <div className={style.progress}>
            <LinearProgress indeterminate={true} />
          </div>}
        {this.state.gameState == Stage.GameState.READY &&
          <img src="/images/swipelogo.png" className={style.swipeGesture} />}
        <Fab
          className={
            this.state.gameState == Stage.GameState.FINISHED
              ? style.fab + ' ' + style.appear
              : style.fab
          }
          onClick={() => {
            this.setState({
              score: 0,
              isReady: true
            });
            this.initGame();
          }}
        >
          <svg
            fill="#FFFFFF"
            height="36"
            viewBox="0 0 24 24"
            width="36"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        </Fab>
        {this.state.gameState !== Stage.GameState.NOTLOADED &&
          <canvas
            id="stage"
            className={style.stage}
            ref={canvas => (this.canvas = canvas)}
          />}
      </div>
    );
  }
}
