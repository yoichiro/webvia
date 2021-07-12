import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import browserAccess from '../../assets/images/top/browser-access.png';
import keyAssign from '../../assets/images/top/key-assign.png';
import lighting from '../../assets/images/top/lighting.png';
import keyLayout from '../../assets/images/top/key-layout.png';
import predefinedKeys from '../../assets/images/top/predefined-keys.png';
import diff from '../../assets/images/top/diff.png';
import keymap from '../../assets/images/top/keymap.png';
import shareKeymap from '../../assets/images/top/share-keymap.png';
import textMatrix from '../../assets/images/top/text-matrix.png';
import Footer from '../common/footer/Footer.container';
import { Logo } from '../common/logo/Logo';
import './Top.scss';

type IFeatureCardProps = {
  image: any;
  imageTitle: string;
  title: string;
  description: string;
};

const FeatureCard = (props: IFeatureCardProps) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className="card">
        <CardMedia
          className="card-media"
          image={props.image}
          title={props.imageTitle}
        />
        <CardContent className="card-content">
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography>{props.description}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

class Top extends React.Component<RouteComponentProps, any> {
  onClickStartRemap = () => {
    this.props.history.push('/configure');
  };

  onClickManageKeyboardDefinitions = () => {
    this.props.history.push('/keyboards');
  };

  onClickKeyboardCatalog = () => {
    this.props.history.push('/catalog');
  };

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <Logo width={128} color={'white'} />
          </Toolbar>
        </AppBar>
        <main>
          <div className="hero-content">
            <Container maxWidth="xl">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                <Logo width={256} color={'black'} />
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
              >
                Remap allows you to configure keymaps and lightings of your
                keyboard with QMK firmware in Web Browser.
              </Typography>
              <div className="hero-buttons">
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.onClickStartRemap}
                    >
                      Start Remap for your keyboard
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={this.onClickManageKeyboardDefinitions}
                    >
                      Register/Manage Keyboard Definitions
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={this.onClickKeyboardCatalog}
                    >
                      Keyboard Catalog
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </div>
          <Container className="card-grid" maxWidth="md">
            <Grid container spacing={4}>
              <FeatureCard
                key={1}
                image={browserAccess}
                imageTitle="Direct Access"
                title="Direct Access"
                description="You can configure your keyboard from Web
                      Browser directly without installing app."
              />
              <FeatureCard
                key={2}
                image={keyAssign}
                imageTitle="Easy key assign"
                title="Easy key assign"
                description="Allow you to assign a complex keymap easily including Hold/Tap and etc."
              />
              <FeatureCard
                key={3}
                image={keymap}
                imageTitle="Save/Restore Keymap"
                title="Save/Restore Keymap"
                description="Apply one of saved key mappings, on demand, anytime and easily."
              />
              <FeatureCard
                key={4}
                image={shareKeymap}
                imageTitle="Share Keymap"
                title="Share Keymap"
                description="Find your best key mapping from key mappings shared by users."
              />
              <FeatureCard
                key={5}
                image={lighting}
                imageTitle="Lighting Control"
                title="Lighting Control"
                description="Simple UI for controlling Backlight and Underglow LED lighting"
              />
              <FeatureCard
                key={6}
                image={keyLayout}
                imageTitle="Key Layout"
                title="Key Layout"
                description="Intuitive customization according to the actual key
                      layout."
              />
              <FeatureCard
                key={7}
                image={predefinedKeys}
                imageTitle="Pre-defined Keys"
                title="Pre-defined Keys"
                description="Provide many Pre-defined keys to enable remap your key
                      mapping easily."
              />
              <FeatureCard
                key={8}
                image={diff}
                imageTitle="Show Difference"
                title="Show Difference"
                description="Easy-to-understand display of keymap changes."
              />
              <FeatureCard
                key={9}
                image={textMatrix}
                imageTitle="Text Matrix"
                title="Text Matrix"
                description="Allows you to test key switches work normally after building your keyboard."
              />
            </Grid>
          </Container>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(Top);
