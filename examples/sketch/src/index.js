/* eslint-disable react/jsx-filename-extension */
/* globals context */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  width as styledWidth, position, space, height as styledHeight,
} from 'styled-system';
import {
  render, Document, Page, Artboard, RedBox,
} from 'react-sketchapp';
import chroma from 'chroma-js';

import {
  styled, ThemeProvider, Box, Text,
} from 'elemental-react';

import Button from '../../../src/buttons/Button';

import theme from './styles/theme';

const StyledText = styled(Text)`
  color: blue;
`;

const Screen = styled(Artboard)`
  ${styledWidth}
  ${position}
  ${space}
  ${styledHeight}
`;

Screen.defaultProps = {
  width: 360,
  position: 'relative',
  ml: 0,
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // static getDerivedStateFromError(error) {
  //   // Update state so the next render will show the fallback UI.
  //   return { hasError: true, error };
  // }

  componentDidCatch(error, info) {
    this.setState({
      error,
      hasError: true,
    });
    // You can also log the error to an error reporting service
    console.log(`
      ${JSON.stringify(error, null, 2)}\n
      ${JSON.stringify(info, null, 2)}
    `);
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { children } = this.props;
    const { error, hasError } = this.state;

    if (hasError) {
      // You can render any custom fallback UI
      return <RedBox error={error} />;
    }

    return children;
  }
}

// take a hex and give us a nice text color to put over it
const textColor = (hex) => {
  const vsWhite = chroma.contrast(hex, 'white');
  if (vsWhite > 4) {
    return '#FFF';
  }
  return chroma(hex)
    .darken(3)
    .hex();
};

const SwatchTile = styled.View`
  height: 250px;
  width: 250px;
  border-radius: 125px;
  margin: 4px;
  background-color: ${props => props.hex};
  justify-content: center;
  align-items: center;
`;

const SwatchName = styled.Text`
  color: ${props => textColor(props.hex)};
  font-size: 32px;
  font-weight: bold;
`;

const Ampersand = styled.Text`
  color: ${props => textColor(props.hex)};
  font-size: 120px;
  font-family: Himalaya;
  line-height: 144px;
`;

const Swatch = ({ name, hex }) => (
  <Box mr={3}>
    <SwatchTile name={`Swatch ${name}`} hex={hex}>
      <Ampersand hex={hex}>&</Ampersand>
    </SwatchTile>
    <Box mt={3} center maxWidth={250}>
      <Text color="greys.8" fontSize={32} mb={2} name="Swatch Name">
        {name}
      </Text>
      <Text color="greys.8" fontSize={32} name="Swatch Hex">
        {hex}
      </Text>
    </Box>
  </Box>
);

const Color = {
  hex: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

Swatch.propTypes = Color;


const DocumentContainer = ({ colors }) => (
  <Document>
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <>
          <Page name="Style Guide">
            <Artboard name="Buttons">
              <Button label="Button" />
              <Button label="Raised" raised />
              <Button label="Unelevated" unelevated />
              <Button label="Outlined" outlined />
            </Artboard>
          </Page>
        </>
      </ThemeProvider>
    </ErrorBoundary>
  </Document>
);

Document.propTypes = {
  colors: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default () => {
  const data = context.document.documentData();
  const pages = context.document.pages();
  render(<DocumentContainer colors={theme.colors} />);
  data.setCurrentPage(pages.firstObject());
};
