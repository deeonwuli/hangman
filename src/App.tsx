import { useCallback, useMemo, useState } from "react";
import "./App.css";
import styled from "styled-components";
import Modal from "./components/modal/Modal";

const word: string = "duby";
const alphabets: string[] = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(97 + i)
);
const NUMBER_OF_LIVES = 3;

function App() {
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

  const isLetterSelected = useCallback(
    (alphabet: string) => selectedLetters.includes(alphabet),
    [selectedLetters]
  );

  const incorrectGuesses = useMemo(
    () => selectedLetters.filter((letter) => !word.includes(letter)).length,
    [selectedLetters]
  );

  const handleLetterClick = useCallback(
    (alphabet: string) => setSelectedLetters((prev) => [...prev, alphabet]),
    []
  );

  const onSave = useCallback(() => {
    setSelectedLetters([]);
  }, []);

  const isWordGuessed = useMemo(() => {
    const allLettersSelected = word
      .split("")
      .every((letter) => isLetterSelected(letter));
    const tooManyIncorrectGuesses = incorrectGuesses >= NUMBER_OF_LIVES;

    return !tooManyIncorrectGuesses && !allLettersSelected
      ? undefined
      : tooManyIncorrectGuesses
      ? false
      : true;
  }, [incorrectGuesses, isLetterSelected]);

  return (
    <Container>
      <HangmanContainer />
      <LivesContainer>
        {Array.from({ length: NUMBER_OF_LIVES }).map((_, index) => (
          <span
            key={index}
            style={{
              backgroundColor:
                index < NUMBER_OF_LIVES - incorrectGuesses ? "none" : "red",
            }}
          >
            ❤️
          </span>
        ))}
      </LivesContainer>
      <WordContainer>
        {word
          .split("")
          .map((letter, index) =>
            isLetterSelected(letter) ? (
              <span key={index}>{letter} </span>
            ) : (
              <span key={index}>_ </span>
            )
          )}
      </WordContainer>
      <LetterContainer>
        {alphabets.map((alphabet) => (
          <Letter
            isLetterSelected={isLetterSelected(alphabet)}
            onClick={() => handleLetterClick(alphabet)}
            key={alphabet}
          >
            {alphabet}
          </Letter>
        ))}
      </LetterContainer>

      {isWordGuessed !== undefined && (
        <Modal onSave={onSave}>
          {isWordGuessed === true ? (
            <p>You Win! 🎉</p>
          ) : (
            <>
              <p>You lost 😔</p>
              <p>The correct word is "{word}"</p>
            </>
          )}
        </Modal>
      )}
    </Container>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  gap: 2rem 0;
`;

const HangmanContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
  width: 20rem;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  background-color: rgb(240, 240, 240);
`;

const LivesContainer = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  width: 5rem;
  border-radius: 10px;
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const WordContainer = styled.div`
  width: max-content;
  display: flex;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1rem;
`;

const LetterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-content: center;
  gap: 1rem;
`;

const Letter = styled.p<{ isLetterSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${(props) =>
    props.isLetterSelected ? "#000" : "rgb(240, 175, 203)"};
  color: #ffffff;
  padding: 8px 16px;
  font-weight: bold;
  font-size: 1.5rem;
  cursor: ${(props) => (props.isLetterSelected ? "not-allowed" : "pointer")};
  transition: 0.3s;
`;
