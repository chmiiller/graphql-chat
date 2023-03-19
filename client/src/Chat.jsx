import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';
import { Container, Row, Col, FormInput, Button } from 'shards-react';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // /graphql?
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
query {
  messages {
    id
    content
    user
  }
}`;

const POST_MESSAGE = gql`
  mutation PostMessage($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

const Messages = ({ user }) => {
  const { data } = useQuery(GET_MESSAGES, {
    pollInterval: 500
  });
  
  if (!data) {
    return null;
  }

  return (
    <>
      {data.messages.map(({ id, user: sender, content }) => {
        const isUser = user === sender;
        return (
          <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            paddingBottom: '1em',
          }}
          key={id}>
            {!isUser && (
              <div
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: '#064663',
                  color: '#F9F5EB',
                  marginRight: '0.5em',
                  borderRadius: 20,
                  textAlign: 'center',
                  fontSize: '13pt',
                  paddingTop: 9,
                }}
              >
                {sender.slice(0,2).toUpperCase()}
              </div>
            )}
            <div style={{
              background: isUser ? '#04293A' : '#9E4784',
              color: '#F9F5EB',
              padding: '1em',
              borderRadius: '1em',
              maxWidth: '60%'
            }}>
              {content}
            </div>
          </div>
        )
      })}
    </>
  )
}

const Chat = () => {
  const [state, stateSet] = useState({
    user: 'Carlos',
    content: ''
  });
  const [postMessage] = useMutation(POST_MESSAGE);

  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }
    stateSet({
      ...state,
      content: ''
    })
  }
  return (
    <Container style={{ marginTop: 20}}>
      <Messages user={state.user} />
      <Row>
        <Col xs={2} style={{ padding: 0 }}>
          <FormInput
            style={{ backgroundColor: '#04293A', border: 'none', color: '#F9F5EB' }}
            label="User"
            value={state.user}
            onChange={(evt) => stateSet({
              ...state,
              user: evt.target.value,
            })}
          />
        </Col>
        <Col xs={6}>
          <FormInput
            style={{ backgroundColor: '#04293A', border: 'none', color: '#F9F5EB' }}
            label="Content"
            value={state.content}
            onChange={(evt) => stateSet({
              ...state,
              content: evt.target.value,
            })}
            onKeyUp={(evt) => {
              if(evt.keyCode === 13) {
                onSend();
              }
            }}
          />
        </Col>
        <Col>
          <Button
            style={{ backgroundColor: '#9E4784', border: 'none' }}
            label="Content"
            value={state.content}
            onClick={onSend}
          >Send</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default () => {
    return (
      <ApolloProvider client={client}>
        <Chat />
      </ApolloProvider>
    )
}