import React from 'react';
import styled from 'styled-components';
import sockerWorker from './WebSocketWorker';

const Panel = styled.div`
    padding: 16px 16px 0 16px;
`;

const StyledButton = styled.button`
    padding: 8px 16px;
    margin: 0 8px 0 0;
    font-size: 16px;
    border: 2px solid ${(props) => (props.disabled ? 'gray' : 'green')}; /* Border color changes too */
    border-radius: 6px;
    background-color: white;
    cursor: pointer;
    color: ${(props) => (props.disabled ? 'gray' : 'green')};
    transition: all 0.3s ease;

    &:disabled {
        cursor: not-allowed;
    }

    &:hover {
        background-color: ${(props) => (props.disabled ? 'white' : '#e6ffe6')};
    }
`;

interface ToolbarProps {
    isSubscribed: boolean;
    subscribeHandler: () => void;
    unsubscribeHandler: () => void;
}

const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
    const { isSubscribed, subscribeHandler, unsubscribeHandler } = props;

    return (
        <Panel>
            <StyledButton disabled={isSubscribed} onClick={subscribeHandler}>
                Subscribe to Angry Stock
            </StyledButton>

            <StyledButton disabled={!isSubscribed} onClick={unsubscribeHandler}>
                Unsubscribe from Angry Stock
            </StyledButton>
        </Panel>
    );
};
export default Toolbar;
