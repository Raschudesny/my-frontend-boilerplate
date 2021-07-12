import React, { FC } from 'react';
import styled from "@emotion/styled";
import { action, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";

class ButtonStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    timesClicked = 0;

    @action('onButtonClick')
    onButtonClick = () => {
        this.timesClicked++;
    }
}

const buttonStore = new ButtonStore();

const App: FC = () => {
    return (
        <div>
            <p>
                Hi,there! All things works correctly =)
            </p>
            <SomeColorfulButton store={buttonStore}/>
        </div>
    );
};

export default App;


const StyledButton = styled.button`
  background-color: #F44336;
  border: none;
  color: white;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
`;

type SomeColorfulButtonProps = {
    store: ButtonStore
}

const SomeColorfulButton = observer(({store}: SomeColorfulButtonProps) => {
    if (store.timesClicked == 0) {
        return <StyledButton onClick={store.onButtonClick}>{`Push me`}</StyledButton>
    }

    return (
        <StyledButton onClick={store.onButtonClick}>{`I was clicked ${store.timesClicked} times`}</StyledButton>
    )
});
