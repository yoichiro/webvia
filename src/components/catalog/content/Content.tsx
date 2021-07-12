import React from 'react';
import { ContentActionsType, ContentStateType } from './Content.container';
import './Content.scss';
import { CircularProgress } from '@material-ui/core';
import Footer from '../../common/footer/Footer.container';
import { ICatalogPhase } from '../../../store/state';
import CatalogSearch from '../search/CatalogSearch.container';
import CatalogKeyboard from '../keyboard/CatalogKeyboard.container';

type ContentState = {};
type OwnProps = {};
type ContentProps = OwnProps &
  Partial<ContentActionsType> &
  Partial<ContentStateType>;

export default class Content extends React.Component<
  ContentProps,
  ContentState
> {
  constructor(props: ContentProps | Readonly<ContentProps>) {
    super(props);
  }

  render() {
    return (
      <div className="catalog-content">
        <Contents phase={this.props.phase!} />
        <Footer />
      </div>
    );
  }
}

type ContentsProps = {
  phase: ICatalogPhase;
};
function Contents(props: ContentsProps) {
  switch (props.phase) {
    case 'init':
    case 'processing':
      return <PhaseProcessing />;
    case 'list':
      return <CatalogSearch />;
    case 'introduction':
    case 'keymap':
      return <CatalogKeyboard />;
    default:
      throw new Error(`Unknown state.catalog.app.phase value: ${props.phase}`);
  }
}

function PhaseProcessing() {
  return (
    <div className="catalog-processing-wrapper">
      <div>
        <CircularProgress size={24} />
      </div>
      <div>Processing...</div>
    </div>
  );
}
