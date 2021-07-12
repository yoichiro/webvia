import React from 'react';
import { SnackbarProvider } from 'notistack';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { StyledComponentProps, withStyles } from '@material-ui/core/styles';
import Configure from './components/configure/Configure.container';
import Hid from './services/hid/ui/Hid';
import Top from './components/top/Top';
import KeyboardDefinitionManagement from './components/keyboards/KeyboardDefinitionManagement.container';
import Catalog from './components/catalog/Catalog.container';

class App extends React.Component<StyledComponentProps, {}> {
  constructor(
    props: StyledComponentProps<string> | Readonly<StyledComponentProps<string>>
  ) {
    super(props);
  }
  render() {
    return (
      <SnackbarProvider
        dense
        preventDuplicate
        hideIconVariant
        maxSnack={4}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{
          variantSuccess: this.props.classes!.success,
          variantError: this.props.classes!.error,
          variantWarning: this.props.classes!.warning,
          variantInfo: this.props.classes!.info,
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/hid" component={Hid} />
            <Route exact path="/configure" component={Configure} />
            <Route
              exact
              path="/keyboards"
              component={KeyboardDefinitionManagement}
            />
            <Route
              path="/keyboards/:definitionId"
              component={KeyboardDefinitionManagement}
            />
            <Route exact path="/catalog">
              <Catalog />
            </Route>
            <Route path="/catalog/:definitionId/keymap">
              <Catalog catalogDetailMode="keymap" />
            </Route>
            <Route path="/catalog/:definitionId">
              <Catalog catalogDetailMode="introduction" />
            </Route>
            <Route component={Top} />
          </Switch>
        </BrowserRouter>
      </SnackbarProvider>
    );
  }
}
const styles = () => ({
  success: { backgroundColor: '#3f51b5!important' },
  error: { backgroundColor: '#f44336!important' },
  warning: { backgroundColor: '#ff9800!important' },
  info: { backgroundColor: '#8bc34a!important' },
});

export default withStyles(styles, { withTheme: true })(App);
