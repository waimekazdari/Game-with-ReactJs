import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'

import HallOfFame, {FAKE_HOF} from './HallOfFame'

import HighScoreInput from './HighScoreInput'

const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS = 750
class App extends Component {
  //initialisation officiel du champs : etat locale
  state = {
    cards: this.generateCards(),
    //currentPair  est un tableau représentant la paire en cours de sélection par la joueuse.
    currentPair: [],
    // guesses est le nombre de tentatives de la partie en cours (nombre de paires tentées, pas nombre de clics)
    guesses: 0,
    //matchedCardIndices  liste les positions des cartes appartenant aux paires déjà réussies, et donc visibles de façon permanente.
    matchedCardIndices: [],
    hallOfFame: null,
  }

  handleNewPairClosedBy(index){

    const { cards, currentPair, guesses, matchedCardIndices } = this.state

    const newPair = [currentPair[0], index]
    const newGuesses = guesses + 1
    const matched = cards[newPair[0]] === cards[newPair[1]]
    this.setState({ currentPair: newPair, guesses: newGuesses })

    if (matched) {
      this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
    }

    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)

  }

  generateCards() {
    const result = []
    const size = SIDE * SIDE
    const candidates = shuffle(SYMBOLS)
    while (result.length < size) {
      const card = candidates.pop()
      result.push(card, card)
    }
    return shuffle(result)
  }

  // This method is declared using an arrow function initializer solely
  // to guarantee its binding, as we cannot use decorators just yet.
  handleCardClick = (index)=> {
    const { currentPair } = this.state

    if(currentPair.lenght === 2)
     return

     if(currentPair.lenght ===0){
       this.setState({ currentPair: [index]})
       return
     }

     this.handleNewPairClosedBy(index)
   }


  getFeedbackForCard(index) {
      const { currentPair, matchedCardIndices } = this.state
      const indexMatched = matchedCardIndices.includes(index)

      if (currentPair.length < 2) {
        return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
      }

      if (currentPair.includes(index)) {
        return indexMatched ? 'justMatched' : 'justMismatched'
      }

  return indexMatched ? 'visible' : 'hidden'
}

  // Arrow fx for binding
  displayHallOfFame = (hallOfFame) => {
    this.setState({ hallOfFame })
  }

  render() {
    const { cards, guesses, hallOfFame, matchedCardIndices} = this.state
    const won = matchedCardIndices.lenght === cards.length
    return (
      <div className="memory">
        <GuessCount guesses={guesses} />
        {cards.map((card, index) => (
          <Card
          card={card}
          feedback={this.getFeedbackForCard(index)}
          index={index}
          key={index}
          onClick={this.handleCardClick}
        />
        ))}
        {/*
          <Card card="😀" feedback="hidden" onClick={this.handleCardClick} />
          <Card card="🎉" feedback="justMatched" onClick={this.handleCardClick} />
          <Card
            card="💖"
            feedback="justMismatched"
            onClick={this.handleCardClick}
          />
          <Card card="🎩" feedback="visible" onClick={this.handleCardClick} />
          <Card card="🐶" feedback="hidden" onClick={this.handleCardClick} />
          <Card card="🐱" feedback="justMatched" onClick={this.handleCardClick} />
           */}

        {won && (hallOfFame ? (
          <HallOfFame entries={hallOfFame} />
        ) : (
          <HighScoreInput guesses={guesses} onStored={this.displayHallOfFame} />
        ))
       }
      </div>
    )
  }
}

export default App
