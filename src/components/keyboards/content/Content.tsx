import React from 'react';
import { ContentActionsType } from '../../configure/content/Content.container';
import { ContentStateType } from './Content.container';
import './Content.scss';
import { CircularProgress } from '@material-ui/core';
import KeyboardList from '../definitionlist/DefinitionList.container';
import CreateKeyboard from '../createdefinition/CreateDefinition.container';
import Footer from '../../common/footer/Footer.container';
import { IKeyboardsPhase, KeyboardsPhase } from '../../../store/state';
import EditKeyboard from '../editdefinition/EditDefinition.container';

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
      <div className="keyboards-content">
        <Contents phase={this.props.phase!} />
        <Footer />
      </div>
    );
  }
}

type ContentsProps = {
  phase: IKeyboardsPhase;
};
function Contents(props: ContentsProps) {
  switch (props.phase) {
    case KeyboardsPhase.signing:
    case KeyboardsPhase.init:
    case KeyboardsPhase.processing:
    case KeyboardsPhase.signout:
      return <PhaseProcessing />;
    case KeyboardsPhase.list:
      return <KeyboardList />;
    case KeyboardsPhase.create:
      return <CreateKeyboard />;
    case KeyboardsPhase.edit:
    case KeyboardsPhase.catalog:
      return <EditKeyboard />;
    default:
      throw new Error(
        `Unknown state.keyboards.app.phase value: ${props.phase}`
      );
  }
}

function PhaseProcessing() {
  return (
    <div className="keyboards-phase-processing-wrapper">
      <div>
        <CircularProgress size={24} />
      </div>
      <div>Processing...</div>
    </div>
  );
}
