import './CatalogIntroduction.scss';
import React from 'react';
import {
  CatalogIntroductionActionsType,
  CatalogIntroductionStateType,
} from './CatalogIntroduction.container';
import {
  Avatar,
  Button,
  Chip,
  Grid,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  getGitHubUserDisplayName,
  getGitHubUserName,
} from '../../../services/storage/Storage';
import { IKeyboardFeatures } from '../../../store/state';
import { Home } from '@material-ui/icons';

const featureMap: { [p: string]: { [p: string]: string } } = {
  over_100: {
    label: 'Over 100%',
    description: 'This keyboard has over 101 keys.',
  },
  '100': {
    label: '100%',
    description: 'This keyboard has about 100 keys.',
  },
  '80': {
    label: '80%',
    description: 'This keyboard has about 80 keys.',
  },
  '60': {
    label: '60%',
    description: 'This keyboard has about 60 keys.',
  },
  '40': {
    label: '40%',
    description: 'This keyboard has about 40 keys.',
  },
  '30': {
    label: '30%',
    description: 'This keyboard has about 30 keys.',
  },
  macro: {
    label: 'Macro',
    description: 'This keyboard has less than 30 keys.',
  },
  split: {
    label: 'Split',
    description: 'This keyboard is divided for a left hand and a right hand.',
  },
  integrated: {
    label: 'Integrated',
    description: 'This keyboard consists of one case.',
  },
  column_staggered: {
    label: 'Column Staggered',
    description: 'Each key is staggered for column direction.',
  },
  row_staggered: {
    label: 'Row Staggered',
    description: 'Each key is staggered for row direction.',
  },
  ortholinear: {
    label: 'Ortholinear',
    description: 'Each key is evenly arranged.',
  },
  symmetrical: {
    label: 'Symmetrical',
    description: 'Each key is arranged symmetrically.',
  },
  underglow: {
    label: 'Underglow LED',
    description: 'This keyboard has LEDs on the bottom.',
  },
  backlight: {
    label: 'Backlight LED',
    description: 'This keyboard has LEDs to light each key from the back.',
  },
  cherry_mx: {
    label: 'Cherry MX',
    description: 'This keyboard supports Cherry MX compatible key switches.',
  },
  kailh_choc: {
    label: 'Kailh Choc',
    description: 'This keyboard supports Kailh Choc low profile key switches.',
  },
  hot_swap: {
    label: 'Hotswap',
    description:
      'This keyboard supports a hot swap feature to exchange key switches without soldering.',
  },
  at90usb1286: {
    label: 'AT90USB1286',
    description: 'This keyboard uses a "AT90USB1286" micro control unit',
  },
  at90usb1287: {
    label: 'AT90USB1287',
    description: 'This keyboard uses a "AT90USB1287" micro control unit',
  },
  at90usb646: {
    label: 'AT90USB646',
    description: 'This keyboard uses a "AT90USB646" micro control unit',
  },
  at90usb647: {
    label: 'AT90USB647',
    description: 'This keyboard uses a "AT90USB647" micro control unit',
  },
  atmega16u2: {
    label: 'ATmega16U2',
    description: 'This keyboard uses a "ATmega16U2" micro control unit',
  },
  atmega16u4: {
    label: 'ATmega16U4',
    description: 'This keyboard uses a "ATmega16U4" micro control unit',
  },
  atmega328p: {
    label: 'ATmega328P',
    description: 'This keyboard uses a "ATmega328P" micro control unit',
  },
  atmega32a: {
    label: 'ATmega32A',
    description: 'This keyboard uses a "ATmega32A" micro control unit',
  },
  atmega32u2: {
    label: 'ATmega32U2',
    description: 'This keyboard uses a "ATmega32U2" micro control unit',
  },
  atmega32u4: {
    label: 'ATmega32U4',
    description: 'This keyboard uses a "ATmega32U4" micro control unit',
  },
  oled: {
    label: 'OLED',
    description: 'This keyboard supports an OLED module.',
  },
  speaker: {
    label: 'Speaker',
    description: 'This keyboard supports a speaker module.',
  },
};

type CatalogIntroductionState = {};
type OwnProps = {};
type CatalogIntroductionProps = OwnProps &
  Partial<CatalogIntroductionActionsType> &
  Partial<CatalogIntroductionStateType>;

export default class CatalogIntroduction extends React.Component<
  CatalogIntroductionProps,
  CatalogIntroductionState
> {
  constructor(
    props: CatalogIntroductionProps | Readonly<CatalogIntroductionProps>
  ) {
    super(props);
  }

  onChangeTab(event: React.ChangeEvent<{}>, value: number) {
    if (value === 1) {
      history.pushState(
        null,
        'Remap',
        `/catalog/${this.props.definitionDocument!.id}/keymap`
      );
      this.props.goToKeymap!();
    }
  }

  // eslint-disable-next-line no-unused-vars
  onClickBackButton(event: React.MouseEvent<{}>) {
    history.pushState(null, 'Remap', '/catalog');
    this.props.goToSearch!();
  }

  render() {
    let descriptionNodeList: React.ReactNode[] | string;
    if (this.props.definitionDocument!.description) {
      descriptionNodeList = this.props
        .definitionDocument!.description.split(/(\n)/)
        .map((item: string, index: number) => {
          return (
            <React.Fragment key={index}>
              {item.match(/\n/) ? <br /> : item}
            </React.Fragment>
          );
        });
    } else {
      descriptionNodeList =
        'A description is not specified by the owner of this keyboard.';
    }
    return (
      <div className="catalog-introduction-wrapper">
        <div className="catalog-introduction-container">
          <Tabs
            variant="fullWidth"
            centered
            value={0}
            indicatorColor="primary"
            className="catalog-introduction-tabs"
            onChange={this.onChangeTab.bind(this)}
          >
            <Tab label="Introduction" />
            <Tab label="Keymap" />
          </Tabs>
          <Paper elevation={0} className="catalog-introduction-content">
            <Grid container>
              <Grid item sm={6} className="catalog-introduction-column">
                <div className="catalog-introduction-image">
                  {this.props.definitionDocument!.imageUrl ? (
                    <img src={this.props.definitionDocument!.imageUrl} />
                  ) : (
                    <div className="catalog-introduction-image-nothing">
                      No Image
                    </div>
                  )}
                </div>
                <section className="catalog-introduction-section">
                  <Typography variant="h2">Features</Typography>
                  <div className="catalog-introduction-chip-container">
                    <FeatureList
                      definitionId={this.props.definitionDocument!.id}
                      features={this.props.definitionDocument!.features}
                    />
                  </div>
                </section>
                <section className="catalog-introduction-section">
                  <Typography variant="h2">Stores</Typography>
                  {this.props.definitionDocument!.stores.length > 0 ? (
                    <div className="catalog-introduction-stores">
                      {this.props.definitionDocument!.stores.map(
                        (store, index) => {
                          return (
                            <Typography key={index} variant="body1">
                              <a
                                href={store.url}
                                target="_blank"
                                rel="noreferrer"
                                className="catalog-introduction-store"
                              >
                                {store.name}
                              </a>
                            </Typography>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div>Not specified by the owner of this keyboard.</div>
                  )}
                </section>
              </Grid>
              <Grid item sm={6} className="catalog-introduction-column">
                <header className="catalog-introduction-header">
                  <div className="catalog-introduction-header-title">
                    <Typography variant="h1">
                      {this.props.definitionDocument!.name}
                    </Typography>
                    <Typography variant="subtitle1">
                      designed by{' '}
                      <a
                        href={this.props.definitionDocument!.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Keyboard Owner GitHub Account"
                      >
                        {getGitHubUserDisplayName(
                          this.props.definitionDocument!
                        )}
                      </a>
                    </Typography>
                  </div>
                  <div className="catalog-introduction-header-links">
                    <div className="catalog-introduction-header-github">
                      <a
                        href={this.props.definitionDocument!.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Keyboard Owner GitHub Account"
                      >
                        <Avatar
                          alt={getGitHubUserDisplayName(
                            this.props.definitionDocument!
                          )}
                          src={`https://avatars.githubusercontent.com/${getGitHubUserName(
                            this.props.definitionDocument!
                          )}`}
                        />
                      </a>
                    </div>
                    {this.props.definitionDocument!.websiteUrl ? (
                      <div className="catalog-introduction-header-home">
                        <a
                          href={this.props.definitionDocument!.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Keyboard Website"
                        >
                          <Home htmlColor="white" fontSize="large" />
                        </a>
                      </div>
                    ) : null}
                  </div>
                </header>
                <section className="catalog-introduction-section">
                  <Typography variant="body1">{descriptionNodeList}</Typography>
                </section>
              </Grid>
            </Grid>
          </Paper>
          <div className="catalog-introduction-nav">
            <Button
              style={{ marginRight: '16px' }}
              onClick={this.onClickBackButton.bind(this)}
            >
              &lt; Back to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

type FeatureListProps = {
  definitionId: string;
  features?: IKeyboardFeatures[];
};

function FeatureList(props: FeatureListProps) {
  if (props.features && props.features.length > 0) {
    return (
      <React.Fragment>
        {props.features.map((feature) => (
          <Tooltip
            key={`feature-${props.definitionId}-${feature}`}
            title={featureMap[feature].description}
          >
            <Chip label={featureMap[feature].label} />
          </Tooltip>
        ))}
      </React.Fragment>
    );
  } else {
    return <div>Not specified by the owner of this keyboard.</div>;
  }
}
